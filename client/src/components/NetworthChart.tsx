/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useNetworthContext from "../contexts/NetworthContext";
import formatCurrency from "../utils/formatDollar";

const NetworthChart = () => {
  const { networth } = useNetworthContext();

  const data = useMemo(() => {
    // create an empty array
    const today = new Date();
    const last90Days = Array.from({ length: 90 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
      return date.toISOString().split("T")[0];
    }).reverse();

    const dataArray = last90Days.map((date) => ({
      name: new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      networth: Math.round(Number(networth[date]) * 100) / 100 || 0,
    }));

    return dataArray;
  }, [networth]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={1000}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis dataKey="name" interval={88} padding={{ left: 55, right: 55 }} />
        <Tooltip />
        <Area type="basis" dataKey="networth" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default NetworthChart;
