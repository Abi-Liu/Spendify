import connection from "../config/db";

export async function createBudget(amount: number, userId: number) {
  const query = `
    INSERT INTO budgets 
        (user_id, budget_amount)
    VALUES 
        ($1, $2)
    RETURNING *
    `;
  const values = [userId, amount];

  const { rows } = await connection.query(query, values);
  return rows[0];
}

export async function getBudgetByUser(userId: number) {
  const query = "SELECT * FROM budgets WHERE userId = $1";
  const values = [userId];
  const { rows } = await connection.query(query, values);

  // for right now users will only have 1 monthly budget entry
  return rows[0];
}
