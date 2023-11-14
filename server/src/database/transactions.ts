import { connection } from "../index";
import { RemovedTransaction, Transaction } from "plaid";
import { getAccountByPlaidAccountId } from "./accounts";

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
    const { id } = await getAccountByPlaidAccountId(accountId);

    try {
      const query = `
      INSERT INTO Transactions (
          account_id,
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        id,
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
  const queries = removed.map(async (id) => {
    const query = `DELETE FROM Transactions WHERE plaid_transaction_id = ?`;
    const values = [id];
    await connection.query(query, values);
  });
  await Promise.all(queries);
}
