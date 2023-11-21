import connection from "../config/db";

// creates a new plaid item
export async function createItem(
  userId: number,
  accessToken: string,
  itemId: string,
  institutionId: string
) {
  // only gets called after linking an item from plaid link flow
  const status = "good";
  const query = `INSERT INTO items
        (user_id, plaid_access_token, plaid_item_id, plaid_institution_id, status)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        *;`;
  const values = [userId, accessToken, itemId, institutionId, status];
  const { rows } = await connection.query(query, values);
  return rows[0];
}

export async function getItemsByPlaidItemId(itemId: string) {
  const query = `SELECT * FROM items WHERE plaid_item_id = $1;`;
  const values = [itemId];
  const { rows } = await connection.query(query, values);
  return rows[0];
}

export async function updateItemCursor(itemId: string, cursor: string) {
  const query = `UPDATE items SET transactions_cursor = $1 WHERE plaid_item_id = $2;`;
  const values = [cursor, itemId];
  await connection.query(query, values);
}

export async function getItemById(itemId: number) {
  const query = `SELECT * FROM items WHERE id = $1`;
  const values = [itemId];
  const { rows } = await connection.query(query, values);
  return rows[0];
}
