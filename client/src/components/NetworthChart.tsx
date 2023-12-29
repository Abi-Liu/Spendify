/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import useNetworthContext from "../contexts/NetworthContext";
import { Card, Stack, Text } from "@mantine/core";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string;
  data: {
    name: string;
    networth: number;
  }[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
  data,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const index = data.findIndex((item) => item.name === label);
    const currentValue = payload[0].value;
    const previousValue = index > 0 ? data[index - 1].networth : 0;
    const difference = currentValue - previousValue;
    const sign = difference >= 0 ? "+" : "-";
    let color;
    if (difference > 0) {
      color = "green";
    } else if (difference < 0) {
      color = "red";
    } else {
      color = "dimmed";
    }
    return (
      <Card shadow="md" padding="md">
        <Stack gap="xs">
          <Text>{`${label}`}</Text>
          <Text size="sm">{`Networth: ${currentValue}`}</Text>
          <Text size="xs" c={color}>
            <Text size="xs" c="var(--mantine-color-text)" component="span">
              1 day change:{" "}
            </Text>
            {`${sign}${difference}`}
          </Text>
        </Stack>
      </Card>
    );
  }

  return null;
};

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
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
        }}
      >
        <XAxis dataKey="name" interval={88} padding={{ left: 45, right: 45 }} />
        <Tooltip content={<CustomTooltip data={data} />} />
        <Area type="basis" dataKey="networth" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default NetworthChart;
