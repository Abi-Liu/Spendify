import { Card, Flex, Text } from "@mantine/core";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

interface PieChartProps {
  categories: { [key: string]: number };
  isMedium: boolean | undefined;
}

const CategoryChart = ({ categories, isMedium }: PieChartProps) => {
  const data = [];
  const labels = Object.keys(categories);
  const values = Object.values(categories);
  for (let i = 0; i < labels.length; i++) {
    data.push({ name: labels[i], value: values[i] });
  }

  const colors = [
    "#8ED8B7",
    "#69B8F4",
    "#C899F4",
    "#6B8CEF",
    "#B5BEC7",
    "#F4D06F",
    "#F48A6B",
    "#B5E36D",
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (value: any) => {
    return `$${value.value.toLocaleString()}`;
  };

  const containerWidth = isMedium ? "100%" : "45%";

  return (
    <Card
      withBorder
      shadow="lg"
      style={{
        width: containerWidth,
        height: "29rem",
      }}
    >
      <Flex
        direction="column"
        align="space-between"
        style={{ marginTop: "1rem", height: "100%" }}
      >
        <Text size="1.5rem" ta="center" style={{ marginTop: "1rem" }}>
          Spending Categories
        </Text>
        <ResponsiveContainer height="85%">
          <PieChart width={350} height={350}>
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
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Flex>
    </Card>
  );
};

export default CategoryChart;
