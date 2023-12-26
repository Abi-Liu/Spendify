import connection from "../config/db";

export async function getAssetsForUser(id: number) {
  const query = `SELECT * FROM assets WHERE user_id = $1`;
  const { rows } = await connection.query(query, [id]);
  return rows;
}

export async function createAsset(
  value: number,
  name: string,
  description: string | null
) {
  const query = `
    INSERT INTO assets
        (value, name, description)
    VALUES
        ($1, $2, $3)
    RETURNING *
    `;
  const values = [value, name, description];
  const { rows } = await connection.query(query, values);
  return rows[0];
}

export async function deleteAsset(id: number) {
  const query = "DELETE FROM assets WHERE id = $1";
  const values = [id];
  await connection.query(query, values);
}
