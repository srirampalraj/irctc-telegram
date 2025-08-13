import { InlineKeyboard } from "grammy";

export class Calendar {
  private currentYear: number;
  private currentMonth: number;
  private selectedDate: Date | null;

  private monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  private dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  constructor() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth(); // Month is zero-indexed
    this.selectedDate = null;
  }

  // Get number of days in the current month
  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate(); // Last day of the month
  }

  // Get the day of the week for the 1st day of the month (0 for Sunday, 6 for Saturday)
  private getFirstDayOfWeek(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
  }

  // Generate the inline keyboard for the current month and year
  public generateInlineKeyboard(): InlineKeyboard {
    const daysInMonth = this.getDaysInMonth(
      this.currentYear,
      this.currentMonth
    );
    const firstDayOfWeek = this.getFirstDayOfWeek(
      this.currentYear,
      this.currentMonth
    );
    const keyboard = new InlineKeyboard();

    const today = new Date();
    const isCurrentMonth =
      this.currentYear === today.getFullYear() &&
      this.currentMonth === today.getMonth();
    const isBeyondOneYear =
      (this.currentYear - today.getFullYear()) * 12 +
        (this.currentMonth - today.getMonth()) >
      12;

    // Add month/year row with prev/next buttons
    if (isCurrentMonth) {
      keyboard.text(" ", "ignore"); // Placeholder for disabled "prev_month"
    } else {
      keyboard.text("<<", "prev_month");
    }
    keyboard
      .text(
        `${this.monthNames[this.currentMonth]} ${this.currentYear}`,
        "ignore"
      )
      .text(
        isBeyondOneYear ? " " : ">>",
        isBeyondOneYear ? "ignore" : "next_month"
      )
      .row();

    // Add the day names row (Mon, Tue, Wed, etc.)
    for (const dayName of this.dayNames) {
      keyboard.text(dayName, "ignore");
    }
    keyboard.row();

    // Add leading empty cells before the first day of the month
    let dayIndex = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Adjust Sunday (0) to be the last day of the week
    for (let i = 0; i < dayIndex; i++) {
      keyboard.text(" ", "ignore"); // Empty buttons to align days correctly
    }

    // Add day buttons for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      if (isCurrentMonth && day < today.getDate()) {
        keyboard.text(" ", "ignore"); // Placeholder for past days
      } else {
        keyboard.text(day.toString(), `date_${day}`);
      }
      dayIndex++;
      if (dayIndex % 7 === 0) {
        keyboard.row();
      }
    }

    // Add trailing empty cells if the last week is not complete
    if (dayIndex % 7 !== 0) {
      const remainingEmptyCells = 7 - (dayIndex % 7);
      for (let i = 0; i < remainingEmptyCells; i++) {
        keyboard.text(" ", "ignore"); // Empty buttons at the end of the row
      }
    }

    return keyboard;
  }

  // Handle month change (prev/next)
  public changeMonth(direction: "prev" | "next"): void {
    if (direction === "prev") {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
    } else if (direction === "next") {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
    }
  }

  // Handle date selection
  public selectDate(day: number): void {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
  }

  // Get the currently selected date
  public getSelectedDate(): Date | null {
    return this.selectedDate;
  }
}
