import connection from "../config/db";

export async function createBudget(amount: number, userId: number) {
  const query = `
    INSERT INTO budgets 
        (user_id, budget_amount)
    VALUES 
        ($1, $2)
    ON CONFLICT 
      (user_id)
    DO UPDATE SET
      budget_amount = $2
    RETURNING *
    `;
  const values = [userId, amount];

  const { rows } = await connection.query(query, values);
  return rows[0];
}

export async function getBudgetByUser(userId: number, date: string) {
  const query = `
  SELECT
    budgets.id,
    budgets.budget_amount,
    budgets.user_id,
    COALESCE(SUM(t.amount), 0) AS total_spending
  FROM
    budgets
  LEFT JOIN
    transactions t ON budgets.user_id = t.user_id
    AND DATE_TRUNC('MONTH', t.date) = DATE_TRUNC('MONTH', CAST('${date}' AS DATE))
    AND DATE_TRUNC('YEAR', t.date) = DATE_TRUNC('YEAR', CAST('${date}' AS DATE))
  WHERE
    budgets.user_id = $1
  GROUP BY
    budgets.id,
    budgets.budget_amount,
    budgets.user_id;
  `;
  const values = [userId];
  const { rows } = await connection.query(query, values);
  if (rows.length === 0) {
    return [];
  } else {
    return rows[0];
  }
}
