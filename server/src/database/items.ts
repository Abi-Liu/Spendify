import { connection } from "../index";

// creates a new plaid item
export async function createItem(
  userId: number,
  accessToken: string,
  itemId: string,
  institutionId: string
) {
  const query =
    "INSERT INTO Plaid_Items (user_id, access_token, item_id, institution_id) VALUES (?, ?, ?, ?)";
  const values = [userId, accessToken, itemId, institutionId];
  const [rows] = await connection.query(query, values);
  return rows;
}

export async function getItemsByItemId(itemId: string) {
  const query = `SELECT * FROM Plaid_Items WHERE item_id = ?`;
  const values = [itemId];
  const [rows] = await connection.query(query, values);
  return rows[0];
}
