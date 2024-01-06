"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plaid_1 = require("../config/plaid");
const plaid_2 = require("plaid");
const updateTransactions_1 = require("../utils/updateTransactions");
const items_1 = require("../database/items");
// using for testing purposes
const accessToken = "access-sandbox-966460a7-f1b2-4668-b5a2-cbfdf6e8036d";
async function itemErrorHandler(plaidItemId, error) {
    const { error_code: errorCode } = error;
    switch (errorCode) {
        case "ITEM_LOGIN_REQUIRED": {
            const { id: itemId } = await (0, items_1.getItemsByPlaidItemId)(plaidItemId);
            await (0, items_1.setItemStatus)(itemId, "bad");
            break;
        }
        default:
            console.log(`WEBHOOK: ITEMS: Plaid item id ${plaidItemId}: unhandled ITEM error`);
    }
}
exports.default = {
    handleWebhook: async (req, res) => {
        try {
            const { item_id: plaidItemId, webhook_code: webhookCode, webhook_type: webhookType, error, } = req.body;
            if (webhookType === "TRANSACTIONS") {
                // this is the only webhook code that needs to be handled, all others are irrelevant:
                // https://plaid.com/docs/api/products/transactions/#sync_updates_available
                if (webhookCode === "SYNC_UPDATES_AVAILABLE") {
                    const { addedLength: added, modifiedLength: modified, removedLength: removed, } = await (0, updateTransactions_1.updateTransactions)(plaidItemId);
                    const { id, user_id } = await (0, items_1.getItemsByPlaidItemId)(plaidItemId);
                    console.log(`ITEM ${id} HAS ${added} NEW TRANSACTIONS, ${modified} MODIFIED TRANSACTIONS, AND ${removed} REMOVED TRANSACTIONS`);
                    // send data to client via socket so client knows to refetch transactions
                    req.io.emit(`SYNC_UPDATES_AVAILABLE_${user_id}`, { id });
                }
            }
            else if (webhookType === "ITEM") {
                if (webhookCode === "PENDING_EXPIRATION") {
                    const { id, user_id } = await (0, items_1.getItemsByPlaidItemId)(plaidItemId);
                    // SET ITEM STATUS TO BAD
                    await (0, items_1.setItemStatus)(id, "bad");
                    console.log(`ITEM ${id} NEEDS TO BE REAUTHENTICATED`);
                    req.io.emit(`PENDING_EXPIRATION_${user_id}`, id);
                }
                else if (webhookCode === "ERROR") {
                    itemErrorHandler(plaidItemId, error);
                    const { id, user_id } = await (0, items_1.getItemsByPlaidItemId)(plaidItemId);
                    console.log(`ERROR: ${error.error_code}: ${error.error_message}`);
                    req.io.emit(`ERROR_${user_id}`, { id, error });
                }
            }
            else {
                console.log(`Unhandled WEBHOOK TYPE: ${webhookType} WEBHOOK CODE: ${webhookCode}, for item ${plaidItemId}`);
            }
            res.status(200).json({ status: "ok" });
        }
        catch (error) {
            console.error("ERROR HANDLING WEBHOOK", error);
            res.status(500);
        }
    },
    // ONLY USED DURING DEVELOPMENT MODE IN SANDBOX
    fireTestWebhook: async (req, res) => {
        try {
            const fireWebhookResponse = await plaid_1.plaidClient.sandboxItemFireWebhook({
                access_token: accessToken,
                webhook_code: plaid_2.SandboxItemFireWebhookRequestWebhookCodeEnum.NewAccountsAvailable,
                webhook_type: plaid_2.WebhookType.Item,
            });
            console.log(fireWebhookResponse.data);
            res.json(fireWebhookResponse.data);
        }
        catch (error) {
            console.error(error);
        }
    },
};
//# sourceMappingURL=webhook.js.map