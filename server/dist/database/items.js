"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItemByItemId = exports.getItemsByUserId = exports.setItemStatus = exports.getItemById = exports.updateItemCursor = exports.getItemsByPlaidItemId = exports.createItem = void 0;
const db_1 = __importDefault(require("../config/db"));
// creates a new plaid item
async function createItem(userId, accessToken, itemId, institutionId) {
    // only gets called after linking an item from plaid link flow
    const status = "good";
    const query = `INSERT INTO items
        (user_id, plaid_access_token, plaid_item_id, plaid_institution_id, status)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        *;`;
    const values = [userId, accessToken, itemId, institutionId, status];
    const { rows } = await db_1.default.query(query, values);
    return rows[0];
}
exports.createItem = createItem;
async function getItemsByPlaidItemId(itemId) {
    const query = `SELECT * FROM items WHERE plaid_item_id = $1;`;
    const values = [itemId];
    const { rows } = await db_1.default.query(query, values);
    return rows[0];
}
exports.getItemsByPlaidItemId = getItemsByPlaidItemId;
async function updateItemCursor(itemId, cursor) {
    const query = `UPDATE items SET transactions_cursor = $1 WHERE plaid_item_id = $2;`;
    const values = [cursor, itemId];
    await db_1.default.query(query, values);
}
exports.updateItemCursor = updateItemCursor;
async function getItemById(itemId) {
    const query = `SELECT * FROM items WHERE id = $1`;
    const values = [itemId];
    const { rows } = await db_1.default.query(query, values);
    return rows[0];
}
exports.getItemById = getItemById;
async function setItemStatus(itemId, status) {
    console.log(`query id = ${itemId}, status = ${status}`);
    const query = `UPDATE items SET status = $1 where id = $2`;
    const values = [status, itemId];
    const rows = await db_1.default.query(query, values);
    return rows;
}
exports.setItemStatus = setItemStatus;
async function getItemsByUserId(userId) {
    const query = "SELECT * FROM items WHERE user_id = $1";
    const values = [userId];
    const { rows } = await db_1.default.query(query, values);
    return rows;
}
exports.getItemsByUserId = getItemsByUserId;
async function deleteItemByItemId(itemId) {
    const query = "DELETE FROM items WHERE id = $1";
    const values = [itemId];
    await db_1.default.query(query, values);
}
exports.deleteItemByItemId = deleteItemByItemId;
//# sourceMappingURL=items.js.map