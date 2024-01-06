"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeTransactions = exports.sanitizeItems = exports.sanitizeAccounts = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const lodash_1 = require("lodash");
// converts all inputs to an array
function toArray(input) {
    return (0, lodash_1.isArray)(input) ? [...input] : [input];
}
// returns an array of objects with only the given keys
function sanitizeWith(input, keep) {
    return toArray(input).map((obj) => (0, lodash_1.pick)(obj, keep));
}
// returns an array of sanitzed accounts, aka the accounts object with no sensitive info to send to client
function sanitizeAccounts(accounts) {
    return sanitizeWith(accounts, [
        "id",
        "item_id",
        "user_id",
        "name",
        "mask",
        "official_name",
        "current_balance",
        "available_balance",
        "iso_currency_code",
        "unofficial_currency_code",
        "type",
        "subtype",
        "created_at",
        "updated_at",
    ]);
}
exports.sanitizeAccounts = sanitizeAccounts;
// returns an array of sanitized items
function sanitizeItems(items) {
    return sanitizeWith(items, [
        "id",
        "user_id",
        "plaid_institution_id",
        "status",
        "created_at",
        "updated_at",
    ]);
}
exports.sanitizeItems = sanitizeItems;
// returns an array of sanitized transactions
function sanitizeTransactions(transactions) {
    return sanitizeWith(transactions, [
        "id",
        "account_id",
        "user_id",
        "item_id",
        "name",
        "payment_channel",
        "date",
        "personal_finance_category",
        "amount",
        "created_at",
        "updated_at",
    ]);
}
exports.sanitizeTransactions = sanitizeTransactions;
//# sourceMappingURL=sanitize.js.map