"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.createUser = exports.getUser = void 0;
const db_1 = __importDefault(require("../config/db"));
// mysql db queries specific for user functionality.
async function getUser(id) {
    const query = "SELECT * from users WHERE google_id = $1;";
    const values = [id];
    const { rows } = await db_1.default.query(query, values);
    return rows[0];
}
exports.getUser = getUser;
async function createUser(id, email, givenName, familyName, photos) {
    const insert = "INSERT INTO users (google_id, email, first_name, last_name, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
    const values = [id, email, givenName, familyName, photos];
    const { rows } = await db_1.default.query(insert, values);
    return rows[0];
}
exports.createUser = createUser;
async function deleteUser(id) {
    const query = "DELETE FROM users WHERE id = $1";
    const values = [id];
    await db_1.default.query(query, values);
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.js.map