import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface PropsInterface {
  spendingPerDay: { [day: number]: number };
}

const DailySpendingChart = ({ spendingPerDay }: PropsInterface) => {
  // formatting spending per day object into data to be used in the bar  chart.
  const data = useMemo(() => {
    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get total number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create an array with all days of the current month
    // creates an array [1, 2, 3, 4, ..., lastDayOfMonth]
    const daysArray = Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    );

    // Map through the daysArray to create the desired array of objects
    const result = daysArray.map((day) => {
      const spendingAmount = spendingPerDay[day] || 0; // Use spending amount if available, otherwise default to 0

      // Format date to the desired string format: "December 1, 2023"
      const date = new Date(currentYear, currentMonth, day);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return {
        name: formattedDate,
        amount: spendingAmount,
        number: day,
      };
    });

    return result;
  }, [spendingPerDay]);

  console.log(data);

  return (
    <ResponsiveContainer height="100%" width="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <ReferenceLine y={0} stroke="#808080" />
        <Bar dataKey="amount" fill="#EC6F27" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailySpendingChart;
