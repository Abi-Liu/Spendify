"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedTransactions = exports.getUserTransactionsFromDates = exports.getAccountTransactionsFromDates = exports.getItemTransactionsFromDates = exports.deleteTransactions = exports.createOrUpdateTransactions = void 0;
const db_1 = __importDefault(require("../config/db"));
const accounts_1 = require("./accounts");
const items_1 = require("./items");
async function createOrUpdateTransactions(added, modified) {
    const transactions = added.concat(modified);
    const queries = transactions.map(async (transaction) => {
        // destructure variable names out to make it easier to use
        const { account_id: accountId, transaction_id: transactionId, personal_finance_category: personalFinanceCategory, payment_channel: paymentChannel, name, amount, iso_currency_code: isoCurrencyCode, unofficial_currency_code: unofficialCurrencyCode, date: transactionDate, pending, account_owner: accountOwner, } = transaction;
        const { id: aid, item_id: itemId, user_id: userId, } = await (0, accounts_1.getAccountByPlaidAccountId)(accountId);
        const { id: iid, plaid_item_id: plaidItemId } = await (0, items_1.getItemById)(itemId);
        try {
            const query = `
      INSERT INTO transactions
            (
              account_id,
              plaid_account_id,
              item_id,
              plaid_item_id,
              plaid_transaction_id,
              personal_finance_category,
              payment_channel,
              name,
              amount,
              iso_currency_code,
              unofficial_currency_code,
              date,
              pending,
              account_owner,
              user_id
            )
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (plaid_transaction_id) DO UPDATE 
            SET 
             personal_finance_category = EXCLUDED.personal_finance_category,
              payment_channel = EXCLUDED.payment_channel,
              name = EXCLUDED.name,
              amount = EXCLUDED.amount,
              iso_currency_code = EXCLUDED.iso_currency_code,
              unofficial_currency_code = EXCLUDED.unofficial_currency_code,
              date = EXCLUDED.date,
              pending = EXCLUDED.pending,
              account_owner = EXCLUDED.account_owner;
  `;
            const values = [
                aid,
                accountId,
                iid,
                plaidItemId,
                transactionId,
                personalFinanceCategory?.primary,
                paymentChannel,
                name,
                amount,
                isoCurrencyCode,
                unofficialCurrencyCode,
                transactionDate,
                pending,
                accountOwner,
                userId,
            ];
            await db_1.default.query(query, values);
        }
        catch (error) {
            console.error(error);
        }
    });
    await Promise.all(queries);
}
exports.createOrUpdateTransactions = createOrUpdateTransactions;
async function deleteTransactions(removed) {
    const queries = removed.map(async (id) => {
        const query = `DELETE FROM transactions WHERE plaid_transaction_id = $1`;
        const values = [id];
        await db_1.default.query(query, values);
    });
    await Promise.all(queries);
}
exports.deleteTransactions = deleteTransactions;
// start is the date futher back in time, end is the more recent date
// aka starting from 2022 ending at 2023
async function getItemTransactionsFromDates(start, end, itemId) {
    const query = `SELECT * FROM Transactions WHERE item_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date DESC`;
    const values = [itemId, start, end];
    const { rows } = await db_1.default.query(query, values);
    return rows;
}
exports.getItemTransactionsFromDates = getItemTransactionsFromDates;
async function getAccountTransactionsFromDates(start, end, accountId) {
    const query = `SELECT * FROM Transactions WHERE account_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date DESC`;
    const values = [accountId, start, end];
    const { rows } = await db_1.default.query(query, values);
    return rows;
}
exports.getAccountTransactionsFromDates = getAccountTransactionsFromDates;
// will be called by the dashboard page to set up monthly spending insights and budgeting purposes
async function getUserTransactionsFromDates(start, end, userId) {
    const query = `SELECT * FROM Transactions WHERE user_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date DESC`;
    const values = [userId, start, end];
    const { rows } = await db_1.default.query(query, values);
    return rows;
}
exports.getUserTransactionsFromDates = getUserTransactionsFromDates;
// used when going through transactions table on client to fetch new transactions for table pagination
async function getPaginatedTransactions(column, columnValue, offset, limit) {
    const query = `
    SELECT * FROM Transactions WHERE ${column} = $1 ORDER BY date DESC LIMIT $2 OFFSET $3;
  `;
    const values = [columnValue, limit, offset];
    const { rows } = await db_1.default.query(query, values);
    return rows;
}
exports.getPaginatedTransactions = getPaginatedTransactions;
//# sourceMappingURL=transactions.js.map