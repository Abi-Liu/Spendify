/* eslint-disable @typescript-eslint/no-explicit-any */
import { pick, isArray } from "lodash";
import { AccountBase, TransactionBase } from "plaid";

// converts all inputs to an array
function toArray(input: any) {
  return isArray(input) ? [...input] : [input];
}

// returns an array of objects with only the given keys
function sanitizeWith(input: any, keep: any) {
  return toArray(input).map((obj) => pick(obj, keep));
}

// returns an array of sanitzed accounts, aka the accounts object with no sensitive info to send to client
export function sanitizeAccounts(accounts: AccountBase[]) {
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

// returns an array of sanitized items
export function sanitizeItems(items: any) {
  return sanitizeWith(items, [
    "id",
    "user_id",
    "institution_id",
    "status",
    "created_at",
    "updated_at",
  ]);
}

// returns an array of sanitized transactions
export function sanitizeTransactions(transactions: TransactionBase[]) {
  sanitizeWith(transactions, [
    "id",
    "account_id",
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
