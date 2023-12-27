import connection from "../config/db";

// mysql db queries specific for user functionality.

export async function getUser(id: string) {
  const query = "SELECT * from users WHERE google_id = $1;";
  const values = [id];
  const { rows } = await connection.query(query, values);
  return rows[0];
}

export async function createUser(
  id: string,
  email: string,
  givenName: string,
  familyName: string,
  photos: string
) {
  const insert =
    "INSERT INTO users (google_id, email, first_name, last_name, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
  const values = [id, email, givenName, familyName, photos];
  const { rows } = await connection.query(insert, values);
  return rows[0];
}

export async function deleteUser(id: number) {
  const query = "DELETE FROM users WHERE id = $1";
  const values = [id];
  await connection.query(query, values);
}
