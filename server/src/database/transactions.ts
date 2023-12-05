import connection from "../config/db";
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
    const {
      id: aid,
      item_id: itemId,
      user_id: userId,
    } = await getAccountByPlaidAccountId(accountId);

    const { id: iid, plaid_item_id: plaidItemId } = await getItemById(itemId);

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
              account_owner
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

      await connection.query(query, values);
    } catch (error) {
      console.error(error);
    }
  });
  await Promise.all(queries);
}

export async function deleteTransactions(removed: RemovedTransaction[]) {
  const queries = removed.map(async (id) => {
    const query = `DELETE FROM transactions WHERE plaid_transaction_id = $1`;
    const values = [id];
    await connection.query(query, values);
  });
  await Promise.all(queries);
}

// start is the date futher back in time, end is the more recent date
// aka starting from 2022 ending at 2023
export async function getItemTransactionsFromDates(
  start: string,
  end: string,
  itemId: string
) {
  const query = `SELECT * FROM Transactions WHERE plaid_item_id = $1 AND date BETWEEN $2 AND $3`;
  const values = [itemId, start, end];
  const { rows } = await connection.query(query, values);
  return rows;
}

export async function getAccountTransactionsFromDates(
  start: string,
  end: string,
  accountId: string
) {
  const query = `SELECT * FROM Transactions WHERE plaid_account_id = $1 AND date BETWEEN $2 AND $3`;
  const values = [accountId, start, end];
  const { rows } = await connection.query(query, values);
  return rows;
}

// export async function get
