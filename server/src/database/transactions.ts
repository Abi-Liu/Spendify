import { connection } from "../index";
import { RemovedTransaction, Transaction } from "plaid";
import { getAccountByPlaidAccountId } from "./accounts";
import { getItemById } from "./items";

export async function createOrUpdateTransactions(
  added: Transaction[],
  modified: Transaction[]
) {
  const transactions = added.concat(modified);
  const queries = transactions.map(async (transaction) => {
    // destructure variable names out to make it easier to use
    const {
      account_id: accountId,
      transaction_id: transactionId,
      personal_finance_category: personalFinanceCategory,
      payment_channel: paymentChannel,
      name,
      amount,
      iso_currency_code: isoCurrencyCode,
      unofficial_currency_code: unofficialCurrencyCode,
      date: transactionDate,
      pending,
      account_owner: accountOwner,
    } = transaction;
    const { id: aid, item_id: itemId } = await getAccountByPlaidAccountId(
      accountId
    );

    const { id: iid, item_id: plaidItemId } = await getItemById(itemId);

    try {
      const query = `
      INSERT INTO Transactions (
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
          account_owner
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
          personal_finance_category = VALUES(personal_finance_category),
          payment_channel = VALUES(payment_channel),
          name = VALUES(name),
          amount = VALUES(amount),
          iso_currency_code = VALUES(iso_currency_code),
          unofficial_currency_code = VALUES(unofficial_currency_code),
          date = VALUES(date),
          pending = VALUES(pending),
          account_owner = VALUES(account_owner);
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
      ];

      await connection.query(query, values);
    } catch (error) {
      console.error(error);
    }
  });
  await Promise.all(queries);
}

export async function deleteTransactions(removed: RemovedTransaction[]) {
  try {
    const queries = removed.map(async (id) => {
      const query = `DELETE FROM Transactions WHERE plaid_transaction_id = ?`;
      const values = [id];
      await connection.query(query, values);
    });
    await Promise.all(queries);
  } catch (error) {
    console.error(error);
  }
}

// start is the date futher back in time, end is the more recent date
// aka starting from 2022 ending at 2023
export async function getItemTransactionsFromDates(
  start: string,
  end: string,
  itemId: string
) {
  try {
    const query = `SELECT * FROM Transactions WHERE plaid_item_id = ? AND date BETWEEN ? AND ?`;
    const values = [itemId, start, end];
    console.log(query, values);
    const [rows] = await connection.query(query, values);
    console.log("rows: ", rows);
    return rows;
  } catch (error) {
    console.error("error fetching item transactions from dates", error);
  }
}

export async function getAccountTransactionsFromDates(
  start: string,
  end: string,
  accountId: string
) {
  try {
    const query = `SELECT * FROM Transactions WHERE plaid_account_id = ? AND date BETWEEN ? AND ?`;
    const values = [accountId, start, end];
    console.log(query, values);
    const [rows] = await connection.query(query, values);
    console.log("rows: ", rows);
    return rows;
  } catch (error) {
    console.error("error fetching account transactions from dates", error);
  }
}
