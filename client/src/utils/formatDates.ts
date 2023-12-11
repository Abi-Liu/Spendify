export default function formatLastThreeMonths() {
  // Get the current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Add 1 because getMonth() returns a zero-based index

  // Calculate the last day of the current month
  const lastDayOfCurrentMonth = new Date(currentYear, currentMonth, 0);
  const endDate = lastDayOfCurrentMonth.toISOString().split("T")[0];

  // Calculate the first day of the month before the previous month
  const twoMonthsAgo = currentMonth - 2;
  const adjustedYear = twoMonthsAgo < 0 ? currentYear - 1 : currentYear;
  const adjustedMonth = twoMonthsAgo < 0 ? 12 + twoMonthsAgo : twoMonthsAgo;
  const firstDayOfPreviousPreviousMonth = new Date(
    adjustedYear,
    adjustedMonth - 1,
    1
  ); // Subtract 1 from adjustedMonth
  const startDate = firstDayOfPreviousPreviousMonth.toISOString().split("T")[0];

  return { startDate, endDate };
}
