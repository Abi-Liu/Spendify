import { connection } from "../index";
import { AccountBase } from "plaid";
import { getItemsByItemId } from "./items";

export async function createOrUpdateAccounts(
  itemId: string,
  accounts: AccountBase[]
) {
  const { id } = await getItemsByItemId(itemId);
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
  console.log(newAccounts);
  return newAccounts;
}

export async function getAccountsByItemId(itemId: string) {
  const query = `SELECT * FROM Account WHERE item_id = ?`;
  const values = [itemId];
  const [data] = await connection.query(query, values);
  return data;
}
