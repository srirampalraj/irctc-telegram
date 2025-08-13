# IRCTC Tatkal Booking Date Reminder Bot

A simple Telegram bot built with **TypeScript** that helps you remember the IRCTC Tatkal booking date for your train journey.  
It calculates the reminder date **60 days before your travel date** and provides you with a **Google Calendar link** so you can add the event directly.

> **Note:** This bot does **not** send you reminders directly. Instead, it generates a Google Calendar event link with pre-filled details (date, time, title, etc.) so that Google Calendar can handle the actual reminder notifications.

---

## ✨ Features

- Accepts your travel date.
- Calculates the IRCTC Tatkal booking opening date (60 days prior).
- Generates a **Google Calendar event link** with:
  - Correct reminder date/time
  - Pre-filled title and description
- Works entirely inside Telegram.

---

## 📦 Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- Node.js runtime

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- Telegram Bot Token from [BotFather](https://core.telegram.org/bots#botfather)

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/srirampalraj/irctc-telegram.git
cd irctc-telegram
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Environment Variables
Create a `.env` file in the project root:
```env
BOT_TOKEN=your_telegram_bot_token_here
```

### 5️⃣ Run the Bot
```bash
npm run build
npm start
```

---

## 📌 Usage

1. Open the bot in Telegram.
2. Send your travel date (e.g., `2025-10-20`).
3. The bot will:
   - Calculate booking date: **2025-08-21** (example)
   - Send you a Google Calendar event creation link.
4. Click the link → Add it to your Google Calendar with notifications enabled.

---

## ⚠️ Disclaimer
This bot **does not** send reminders by itself.  
It only helps you create Google Calendar events so that Google handles reminders.

---

## 📝 License
This project is licensed under the [MIT License](LICENSE).

---

## 💡 Contributing
Pull requests are welcome!  
If you have suggestions for improvements, feel free to open an issue or PR.
