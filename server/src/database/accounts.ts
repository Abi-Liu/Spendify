import { connection } from "../index";
import { AccountBase } from "plaid";
import { getItemsByPlaidItemId } from "./items";

export async function createOrUpdateAccounts(
  itemId: string,
  accounts: AccountBase[]
) {
  try {
    const { id } = await getItemsByPlaidItemId(itemId);
    console.log(id);
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
    INSERT INTO Account
    (
        item_id,
        account_id,
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        current_balance = VALUES(current_balance),
        available_balance = VALUES(available_balance);
    `;
      const values = [
        id,
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
      await connection.query(query, values);
    });
    await Promise.all(queries);
    const newAccounts = await getAccountsByItemId(itemId);
    return newAccounts;
  } catch (error) {
    console.error(error);
  }
}

export async function getAccountsByItemId(itemId: string) {
  try {
    const { id } = await getItemsByPlaidItemId(itemId);
    const query = `SELECT * FROM Account WHERE item_id = ?;`;
    const values = [id];
    const [data] = await connection.query(query, values);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getAccountByPlaidAccountId(accountId: string) {
  try {
    const query = `SELECT * FROM Account WHERE account_id = ?`;
    const values = [accountId];
    const [rows] = await connection.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(error);
  }
}
