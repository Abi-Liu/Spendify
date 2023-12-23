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
// import { TbPencil } from "react-icons/tb";

const BudgetChart = () => {
  const { budgets } = useBudgetsContext();
  const budget: Budget = Object.values(budgets)[0];

  const spentPercentage = Math.round(
    (budget.total_spending / budget.budget_amount) * 100
  );
  const remainingPercentage =
    100 - spentPercentage < 0 ? 0 : 100 - spentPercentage;

  function getMessage() {
    if (spentPercentage < 25) {
      return "Great job managing your budget! Keep up the excellent work! 🌟";
    } else if (spentPercentage < 50) {
      return "You're doing well! Just stay on track, and you've got this! 🚀";
    } else if (spentPercentage < 75) {
      return "Things are getting a bit tight! Watch those expenses closely! 💸";
    } else if (spentPercentage < 100) {
      return "You're approaching your budget limit. Let's cut back a bit! ⚠️";
    } else {
      return "You've spent more than your budget. Time to reassess expenses! 🚨";
    }
  }
  const message = getMessage();

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
    <ResponsiveContainer height="100%" width="85%">
      <PieChart width={500} height={500}>
        <Legend />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={77}
          outerRadius={95}
          paddingAngle={5}
          isAnimationActive={true}
          label={renderLabel}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            value={`${formatCurrency(Number(budget.total_spending))}`}
            position="centerBottom"
            style={{ fontWeight: "bold" }}
            dy={-20}
          />
          <Label
            value={`of ${formatCurrency(Number(budget.budget_amount))}`}
            position="centerBottom"
            dy={0}
            style={{ fontSize: ".75rem" }}
          />
          <Label
            value={message}
            position="centerTop"
            dy={20}
            width={130}
            style={{
              fontSize: "0.675rem",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BudgetChart;
