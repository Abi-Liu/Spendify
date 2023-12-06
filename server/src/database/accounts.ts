import connection from "../config/db";
import { AccountBase } from "plaid";
import { getItemsByPlaidItemId } from "./items";

export async function createOrUpdateAccounts(
  itemId: string,
  accounts: AccountBase[]
) {
  const { id, user_id } = await getItemsByPlaidItemId(itemId);

  const queries = accounts.map(async (account) => {
    // destructuring the variables out of the account object
    const {
      account_id: aid,
      name,
      mask,
      official_name: officialName,
      balances: {
        available: availableBalance,
        current: currentBalance,
        iso_currency_code: isoCurrencyCode,
        unofficial_currency_code: unofficialCurrencyCode,
      },
      subtype,
      type,
    } = account;

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

    const { rows } = await connection.query(query, values);
    return rows;
  });
  return await Promise.all(queries);
}

export async function getAccountsByItemId(itemId: string) {
  const query = `SELECT * FROM accounts WHERE item_id = $1;`;
  const values = [itemId];
  const { rows } = await connection.query(query, values);
  return rows;
}

export async function getAccountByPlaidAccountId(accountId: string) {
  const query = `SELECT * FROM accounts WHERE plaid_account_id = $1`;
  const values = [accountId];
  const { rows } = await connection.query(query, values);
  return rows[0];
}

// need to add user_id column to accounts table
export async function getAccountsByUserId(userId: string) {
  const query = `SELECT * FROM accounts WHERE user_id = $1`;
  const values = [userId];
  const { rows } = await connection.query(query, values);
  return rows;
}

export async function deleteAccountsByItemId(itemId: string) {
  const query = `DELETE FROM accounts WHERE item_id = $1`;
  const values = [itemId];
  await connection.query(query, values);
}
