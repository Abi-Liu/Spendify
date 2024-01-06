"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactions = void 0;
const items_1 = require("../database/items");
const plaid_1 = require("../config/plaid");
const transactions_1 = require("../database/transactions");
const accounts_1 = require("../database/accounts");
async function fetchTransactionUpdates(itemId) {
    const { plaid_access_token: accessToken, transactions_cursor: lastCursor } = await (0, items_1.getItemsByPlaidItemId)(itemId);
    let cursor = lastCursor;
    // New transaction updates since "cursor"
    let added = [];
    let modified = [];
    // Removed transaction ids
    let removed = [];
    let hasMore = true;
    try {
        // Iterate through each page of new transaction updates for item
        while (hasMore) {
            const request = {
                access_token: accessToken,
                cursor,
            };
            const response = await plaid_1.plaidClient.transactionsSync(request);
            const data = response.data;
            // Add this page of results
            added = added.concat(data.added);
            modified = modified.concat(data.modified);
            removed = removed.concat(data.removed);
            hasMore = data.has_more;
            // Update cursor to the next cursor
            cursor = data.next_cursor;
        }
    }
    catch (error) {
        cursor = lastCursor;
        console.error(`Error fetching transactions: ${error.message}`);
    }
    return { added, modified, removed, cursor, accessToken };
}
async function updateTransactions(plaidItemId) {
    // Fetch new transactions from plaid api.
    const { added, modified, removed, cursor, accessToken } = await fetchTransactionUpdates(plaidItemId);
    // get accounts here so that the balance is updated everytime we update the transactions via webhooks.
    const { data } = await plaid_1.plaidClient.accountsGet({
        access_token: accessToken,
    });
    const accounts = data.accounts;
    // update the db
    // fetch and store the accounts that are associated with the item:
    await (0, accounts_1.createOrUpdateAccounts)(plaidItemId, accounts);
    await (0, transactions_1.createOrUpdateTransactions)(added, modified);
    await (0, transactions_1.deleteTransactions)(removed);
    await (0, items_1.updateItemCursor)(plaidItemId, cursor);
    // update the redis cache ? Is this even necessary? And if so, how would I go about caching the data?
    // cache all transactions for the plaid_item_id
    // grab the most recent 1 years worth of transactions for the plaid item and cache those transactions
    // const currentDate = new Date();
    // const startDate = new Date(
    //   currentDate.getFullYear() - 1,
    //   currentDate.getMonth(),
    //   currentDate.getDate()
    // );
    // const formattedStartDate = startDate.toISOString().split("T")[0];
    // const formattedEndDate = currentDate.toISOString().split("T")[0];
    // retrieve the most recent years worth of transactions for an item from the db
    // const itemTransactionsToCache = await getItemTransactionsFromDates(
    //   formattedStartDate,
    //   formattedEndDate,
    //   itemId
    // );
    // cache the data in redis
    // redis.set(
    //   `itemTransactions:${itemId}`,
    //   JSON.stringify(itemTransactionsToCache)
    // );
    // cache all transactions for the plaid_account_id: unneeded?
    // cache account information, to keep balance up to date. unneeded?
    return {
        addedLength: added.length,
        modifiedLength: modified.length,
        removedLength: removed.length,
    };
}
exports.updateTransactions = updateTransactions;
//# sourceMappingURL=updateTransactions.js.map