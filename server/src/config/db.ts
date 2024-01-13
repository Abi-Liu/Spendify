import { Pool } from "pg";

// create the connection to database
const { DB_PORT, POSTGRES_USER, POSTGRES_PASSWORD, DB_HOST, DB_NAME } =
  process.env;

if (!DB_PORT || !POSTGRES_USER || !POSTGRES_PASSWORD || !DB_HOST) {
  throw new Error("DB variables are undefined");
}

const connection = new Pool({
  host: DB_HOST,
  port: parseInt(DB_PORT),
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000, // waits 30 seconds before closing idle connections
  connectionTimeoutMillis: 2000, // throws error if unable to connect to db after 2 seconds
});

export default connection;
