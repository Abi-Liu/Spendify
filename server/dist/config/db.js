"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// create the connection to database
const { DB_PORT, POSTGRES_USER, POSTGRES_PASSWORD, DB_HOST } = process.env;
if (!DB_PORT || !POSTGRES_USER || !POSTGRES_PASSWORD || !DB_HOST) {
    throw new Error("DB variables are undefined");
}
const connection = new pg_1.Pool({
    host: DB_HOST,
    port: parseInt(DB_PORT),
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000, // throws error if unable to connect to db after 2 seconds
});
exports.default = connection;
//# sourceMappingURL=db.js.map