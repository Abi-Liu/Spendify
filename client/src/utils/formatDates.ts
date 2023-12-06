export default function formatLastThreeMonths() {
  // format dates - get the last day of the current month and the first day of the previous previous month
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const lastDayOfCurrentMonth = new Date(year, month, 0);
  const twoMonthsAgo = month - 2;
  // Handle the case where the current month is January or February
  // Adjust the year and month accordingly
  const adjustedYear = twoMonthsAgo < 0 ? year - 1 : year;
  const adjustedMonth = twoMonthsAgo < 0 ? 12 + twoMonthsAgo : twoMonthsAgo; // Adjust the month value for previous months
  const firstDayOfPreviousPreviousMonth = new Date(
    adjustedYear,
    adjustedMonth,
    1
  );

  const startDate = firstDayOfPreviousPreviousMonth.toISOString().split("T")[0];
  const endDate = lastDayOfCurrentMonth.toISOString().split("T")[0];
  return { startDate, endDate };
}
