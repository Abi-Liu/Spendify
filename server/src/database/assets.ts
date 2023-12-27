import connection from "../config/db";

export async function getAssetsForUser(id: number) {
  const query = `SELECT * FROM assets WHERE user_id = $1`;
  const { rows } = await connection.query(query, [id]);
  return rows;
}

export async function createAsset(
  userId: number,
  value: number,
  name: string,
  description: string | null
) {
  const query = `
    INSERT INTO assets
        (user_id, value, name, description)
    VALUES
        ($1, $2, $3, $4)
    RETURNING *
    `;
  const values = [userId, value, name, description];
  const { rows } = await connection.query(query, values);
  return rows;
}

export async function deleteAsset(id: number) {
  const query = "DELETE FROM assets WHERE id = $1";
  const values = [id];
  await connection.query(query, values);
}
