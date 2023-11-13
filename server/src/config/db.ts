import mysql from "mysql2/promise";

// create the connection to database
export default async function connectDB() {
  console.log("Connecting to the database...");
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  console.log("Connected to the database!");
  return connection;
}
