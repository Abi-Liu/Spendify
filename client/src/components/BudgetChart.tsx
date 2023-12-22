import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import useBudgetsContext, { Budget } from "../contexts/BudgetsContext";
import formatCurrency from "../utils/formatDollar";

const BudgetChart = () => {
  const { budgets } = useBudgetsContext();
  const budget: Budget = Object.values(budgets)[0];

  const spentPercentage = Math.round(
    (budget.total_spending / budget.budget_amount) * 100
  );
  const remainingPercentage =
    100 - spentPercentage < 0 ? 0 : 100 - spentPercentage;

  const data = [
    { name: "Spent", value: spentPercentage },
    { name: "Remaining", value: remainingPercentage },
  ];

  const COLORS = ["#FF6347", "#3CB371"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (value: any) => {
    return `${value.value}%`;
  };

  return (
    <ResponsiveContainer height="100%">
      <PieChart width={500} height={500}>
        <Legend />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          paddingAngle={5}
          isAnimationActive={false}
          label={renderLabel}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            value={`${formatCurrency(Number(budget.total_spending))}`}
            position="center"
            style={{ fontWeight: "bold" }}
          />
          <Label
            value={`of ${formatCurrency(Number(budget.budget_amount))}`}
            position="center"
            dy={22}
            style={{ fontSize: ".75rem" }}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BudgetChart;
