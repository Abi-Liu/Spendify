"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAsset = exports.createAsset = exports.getAssetsForUser = void 0;
const db_1 = __importDefault(require("../config/db"));
async function getAssetsForUser(id) {
    const query = `SELECT * FROM assets WHERE user_id = $1`;
    const { rows } = await db_1.default.query(query, [id]);
    return rows;
}
exports.getAssetsForUser = getAssetsForUser;
async function createAsset(userId, value, name, description) {
    const query = `
    INSERT INTO assets
        (user_id, value, name, description)
    VALUES
        ($1, $2, $3, $4)
    RETURNING *
    `;
    const values = [userId, value, name, description];
    const { rows } = await db_1.default.query(query, values);
    return rows;
}
exports.createAsset = createAsset;
async function deleteAsset(id) {
    const query = "DELETE FROM assets WHERE id = $1";
    const values = [id];
    await db_1.default.query(query, values);
}
exports.deleteAsset = deleteAsset;
//# sourceMappingURL=assets.js.map