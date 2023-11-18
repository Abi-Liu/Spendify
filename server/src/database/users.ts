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
  givenName: string,
  familyName: string,
  photos: string
) {
  const insert =
    "INSERT INTO users (google_id, first_name, last_name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *;";
  const values = [id, givenName, familyName, photos];
  const { rows } = await connection.query(insert, values);
  return rows[0];
}
