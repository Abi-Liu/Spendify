"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountsByItemId = exports.getAccountsByUserId = exports.getAccountByPlaidAccountId = exports.getAccountsByItemId = exports.createOrUpdateAccounts = void 0;
const db_1 = __importDefault(require("../config/db"));
const items_1 = require("./items");
async function createOrUpdateAccounts(itemId, accounts) {
    const { id, user_id } = await (0, items_1.getItemsByPlaidItemId)(itemId);
    const queries = accounts.map(async (account) => {
        // destructuring the variables out of the account object
        const { account_id: aid, name, mask, official_name: officialName, balances: { available: availableBalance, current: currentBalance, iso_currency_code: isoCurrencyCode, unofficial_currency_code: unofficialCurrencyCode, }, subtype, type, } = account;
        const query = `
        INSERT INTO accounts
          (
            item_id,
            user_id,
            plaid_account_id,
            name,
            mask,
            official_name,
            current_balance,
            available_balance,
            iso_currency_code,
            unofficial_currency_code,
            type,
            subtype
          )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT
          (plaid_account_id)
        DO UPDATE SET
          current_balance = $7,
          available_balance = $8
        RETURNING
          *
    `;
        const values = [
            id,
            user_id,
            aid,
            name,
            mask,
            officialName,
            currentBalance,
            availableBalance,
            isoCurrencyCode,
            unofficialCurrencyCode,
            type,
            subtype,
        ];
        const { rows } = await db_1.default.query(query, values);
        return rows;
    });
    return await Promise.all(queries);
}
exports.createOrUpdateAccounts = createOrUpdateAccounts;
async function getAccountsByItemId(itemId) {
    const query = `SELECT * FROM accounts WHERE item_id = $1;`;
    const values = [itemId];
    const { rows } = await db_1.default.query(query, values);
    return rows;
}
exports.getAccountsByItemId = getAccountsByItemId;
async function getAccountByPlaidAccountId(accountId) {
    const query = `SELECT * FROM accounts WHERE plaid_account_id = $1`;
    const values = [accountId];
    const { rows } = await db_1.default.query(query, values);
    return rows[0];
}
exports.getAccountByPlaidAccountId = getAccountByPlaidAccountId;
// need to add user_id column to accounts table
async function getAccountsByUserId(userId) {
    const query = `SELECT * FROM accounts WHERE user_id = $1`;
    const values = [userId];
    const { rows } = await db_1.default.query(query, values);
    return rows;
}
exports.getAccountsByUserId = getAccountsByUserId;
async function deleteAccountsByItemId(itemId) {
    const query = `DELETE FROM accounts WHERE item_id = $1`;
    const values = [itemId];
    await db_1.default.query(query, values);
}
exports.deleteAccountsByItemId = deleteAccountsByItemId;
//# sourceMappingURL=accounts.js.map