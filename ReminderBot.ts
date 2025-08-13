import { Bot, webhookCallback } from "grammy";
import moment from "moment";
import { Calendar } from "./calendar";
import * as moment_ from "moment-timezone";
import express from "express";
import * as dotenv from "dotenv";

const moment_timezone = moment_.default;
const app = express();
dotenv.config();

//Create a new bot
const bot = new Bot(process.env.BOT_TOKEN as string);

app.use(express.json()); // For parsing application/json
app.use("/webhook", webhookCallback(bot, "express")); // Grammy's webhook middleware

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // 6. Set the webhook (update this with your public URL)
  bot.api
    .setWebhook(`https://irctc-telegram.onrender.com/`)
    .then(() => {
      console.log("Webhook set successfully");
    })
    .catch((err) => {
      console.error("Error setting webhook:", err);
    });
});

const calendar = new Calendar();

bot.command("start", async (ctx) => {
  await ctx.reply(
    `Hi ${ctx.from?.first_name} 👋!
Start with /remind to send a date!`
  );
});

bot.command("remind", async (ctx) => {
  const calendarMarkup = calendar.generateInlineKeyboard();
  await ctx.reply("Please select a date:", {
    reply_markup: calendarMarkup,
  });
});

bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;

  // Ignore placeholder buttons
  if (data === "ignore") {
    await ctx.answerCallbackQuery(); // Acknowledge the callback without any action
    return;
  }

  if (data === "prev_month") {
    calendar.changeMonth("prev");
  } else if (data === "next_month") {
    calendar.changeMonth("next");
  } else if (data && data.startsWith("date_")) {
    const day = parseInt(data.split("_")[1]);
    calendar.selectDate(day);
    const selectedDate = calendar.getSelectedDate() as Date;

    // Check if the selected date is less than 60 days away
    const today = new Date();
    const diffInDays = Math.floor(
      (selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays <= 60) {
      await ctx.answerCallbackQuery(); // Acknowledge the callback
      await ctx.reply("⚠️ Booking already started!");
      return;
    }

    await ctx.answerCallbackQuery(); // Acknowledge the callback
    await ctx.reply(`You selected: ${selectedDate}`);
    const dates = getEventDate(selectedDate);
    await ctx.reply(
      `Click [here](https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${
        dates[0]
      }%2F${
        dates[1]
      }&details=Booking%20starts%20at%208%3A00%20AM&location=&text=IRCTC%20Ticket%20Reminder%20for%20${moment(
        selectedDate
      ).format("DD MMM YYYY")}) to add this to Google Calendar`,
      { parse_mode: "MarkdownV2" }
    );
    return;
  }

  const updatedMarkup = calendar.generateInlineKeyboard();
  await ctx.editMessageReplyMarkup({ reply_markup: updatedMarkup });
  await ctx.answerCallbackQuery(); // Acknowledge the callback
});

const getEventDate = (date: Date): [string, string] => {
  return [
    moment(new Date(reduceDaysAndSetTime(date, true) * 1000)).format(
      "YYYYMMDDTHHmmss"
    ) + "Z",
    moment(new Date(reduceDaysAndSetTime(date, false) * 1000)).format(
      "YYYYMMDDTHHmmss"
    ) + "Z",
  ];
};

const reduceDaysAndSetTime = (date: Date, first: boolean): number => {
  const reducedDate = new Date(date);
  reducedDate.setDate(reducedDate.getDate() - 60);
  first ? reducedDate.setHours(2, 15, 0, 0) : reducedDate.setHours(4, 15, 0, 0);
  return Math.floor(reducedDate.getTime() / 1000);
};

//Start the Bot
bot.api
  .deleteWebhook()
  .then(() => {
    console.log("Webhook deleted, switching to getUpdates (polling).");

    // 3. Start the bot in polling mode
    bot.start();
  })
  .catch((err) => {
    console.error("Error deleting webhook:", err);
  });

bot.catch((err) => {
  if (err.message.includes("query is too old")) {
    console.error("Callback query is too old to respond to:", err);
  } else {
    console.error("An error occurred:", err);
  }
});
