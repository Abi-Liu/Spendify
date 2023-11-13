import { connection } from "../index";

// mysql db queries specific for user functionality.

export async function getUser(id: number) {
  const query = "SELECT * from Users WHERE google_id = ?;";
  const values = [id];
  const [user] = await connection.query(query, values);
  console.log(user[0]);
  return user[0];
}

export async function createUser(
  id: number,
  givenName: string,
  familyName: string,
  photos: string
) {
  const insert =
    "INSERT INTO Users (google_id, first_name, last_name, avatar_url) VALUES (?, ?, ?, ?);";
  const values = [id, givenName, familyName, photos];
  const [user] = await connection.query(insert, values);
  const [data] = await connection.query(`SELECT * FROM Users WHERE id = ?`, [
    user.insertId,
  ]);
  return data[0];
}
