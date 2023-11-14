import { getItemsByPlaidItemId, updateItemCursor } from "../database/items";
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

async function fetchTransactionUpdates(itemId: string) {
  const { access_token: accessToken, transactions_cursor: lastCursor } =
    await getItemsByPlaidItemId(itemId);
  console.log(accessToken);
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
    console.log("added", added);
    console.log("modified", modified);
    console.log("removed", removed);
  } catch (error) {
    cursor = lastCursor;
    console.error(`Error fetching transactions: ${error.message}`);
  }

  return { added, modified, removed, cursor };
}

export async function updateTransactions(itemId: string) {
  // Fetch new transactions from plaid api.
  const { added, modified, removed, cursor } = await fetchTransactionUpdates(
    itemId
  );

  // update the db
  createOrUpdateTransactions(added, modified);
  deleteTransactions(removed);
  updateItemCursor(itemId, cursor);

  return {
    addedLength: added.length,
    modifiedLength: modified.length,
    removedLength: removed.length,
  };
}
