import connection from "../config/db";

export async function createBudget(amount: number, userId: number) {
  const query = `
    INSERT INTO budgets 
        (user_id, budget_amount)
    VALUES 
        ($1, $2)
    RETURNING
    `;
  const values = [userId, amount];

  const { rows } = await connection.query(query, values);
  return rows;
}
