import { connection } from "../index";

// creates a new plaid item
export async function createItem(
  userId: number,
  accessToken: string,
  itemId: string,
  institutionId: string
) {
  try {
    const query =
      "INSERT INTO Plaid_Items (user_id, access_token, item_id, institution_id) VALUES (?, ?, ?, ?);";
    const values = [userId, accessToken, itemId, institutionId];
    const [rows] = await connection.query(query, values);
    const getQuery = `SELECT * FROM Plaid_Items WHERE id = ?`;
    const getValues = [rows.insertId];
    const [item] = await connection.query(getQuery, getValues);
    return item;
  } catch (error) {
    console.error(error);
  }
}

export async function getItemsByPlaidItemId(itemId: string) {
  try {
    const query = `SELECT * FROM Plaid_Items WHERE item_id = ?;`;
    const values = [itemId];
    const [rows] = await connection.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateItemCursor(itemId: string, cursor: any) {
  const query = `UPDATE Plaid_Items SET transactions_cursor = ? WHERE item_id = ?`;
  const values = [cursor, itemId];
  await connection.query(query, values);
}

export async function getItemById(itemId: string) {
  const query = `SELECT * FROM Plaid_Items WHERE id = ?`;
  const values = [itemId];
  const [rows] = await connection.query(query, values);
  return rows[0];
}
