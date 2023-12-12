import { Container, Flex, Text } from "@mantine/core";
import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

interface PieChartProps {
  categories: { [key: string]: number };
}

const CategoryChart = ({ categories }: PieChartProps) => {
  const data = [];
  const labels = Object.keys(categories);
  const values = Object.values(categories);
  for (let i = 0; i < labels.length; i++) {
    data.push({ name: labels[i], value: values[i] });
  }

  const colors = ["#8ED8B7", "#69B8F4", "#C899F4", "#6B8CEF", "#B5BEC7"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (value: any) => {
    return `$${value.value.toLocaleString()}`;
  };

  return (
    <Container style={{ border: "1px solid #808080", width: "45%" }}>
      <Flex
        direction="column"
        align="space-between"
        style={{ marginTop: "1.15rem", height: "100%" }}
      >
        <Text size="1.5rem" ta="center" style={{ marginTop: "1rem" }}>
          Spending Categories
        </Text>
        <PieChart width={400} height={400}>
          <Legend />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            isAnimationActive={true}
            label={renderLabel}
            paddingAngle={5}
            innerRadius={70}
            outerRadius={90}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </Flex>
    </Container>
  );
};

export default CategoryChart;
