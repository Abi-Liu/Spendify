import {
  getItemsByPlaidItemId,
  updateItemCursor,
  updateItemTransactionCount,
} from "../database/items";
import { plaidClient } from "../config/plaid";
import {
  RemovedTransaction,
  Transaction,
  TransactionsSyncRequest,
} from "plaid";
import {
  createOrUpdateTransactions,
  deleteTransactions,
} from "../database/transactions";
import {
  createOrUpdateAccounts,
  updateAccountTransactionCount,
} from "../database/accounts";
import { updateUserTransactionCount } from "../database/users";

async function fetchTransactionUpdates(itemId: string) {
  const {
    plaid_access_token: accessToken,
    transactions_cursor: lastCursor,
    user_id: userId,
  } = await getItemsByPlaidItemId(itemId);
  let cursor = lastCursor;

  // New transaction updates since "cursor"
  let added: Array<Transaction> = [];
  let modified: Array<Transaction> = [];
  // Removed transaction ids
  let removed: Array<RemovedTransaction> = [];
  let hasMore = true;
  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const request: TransactionsSyncRequest = {
        access_token: accessToken,
        cursor,
      };

      const response = await plaidClient.transactionsSync(request);
      const data = response.data;

      // Add this page of results
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);
      hasMore = data.has_more;

      // Update cursor to the next cursor
      cursor = data.next_cursor;
    }
  } catch (error) {
    cursor = lastCursor;
    console.error(`Error fetching transactions: ${error.message}`);
  }

  return { added, modified, removed, cursor, accessToken, userId };
}

export async function updateTransactions(plaidItemId: string) {
  // Fetch new transactions from plaid api.
  const { added, modified, removed, cursor, accessToken, userId } =
    await fetchTransactionUpdates(plaidItemId);

  // get accounts here so that the balance is updated everytime we update the transactions via webhooks.
  const { data } = await plaidClient.accountsGet({
    access_token: accessToken,
  });
  const accounts = data.accounts;

  // update the db
  // fetch and store the accounts that are associated with the item:
  await createOrUpdateAccounts(plaidItemId, accounts);
  await createOrUpdateTransactions(added, modified);
  await deleteTransactions(removed);
  await updateItemCursor(plaidItemId, cursor);

  // Now we have to update the transactions_count column for item, account and user tables
  await updateAccountTransactionCount(
    plaidItemId,
    added.length,
    removed.length
  );
  await updateItemTransactionCount(plaidItemId, added.length, removed.length);
  await updateUserTransactionCount(userId, added.length, removed.length);

  return {
    addedLength: added.length,
    modifiedLength: modified.length,
    removedLength: removed.length,
  };
}
