import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import {
  SandboxItemFireWebhookRequestWebhookCodeEnum,
  WebhookType,
} from "plaid";
import { updateTransactions } from "../utils/updateTransactions";
import { getItemsByPlaidItemId } from "../database/items";

// using for testing purposes
const accessToken = "access-sandbox-966460a7-f1b2-4668-b5a2-cbfdf6e8036d";

export default {
  handleWebhook: async (req: Request, res: Response) => {
    try {
      const {
        item_id: plaidItemId,
        webhook_code: webhookCode,
        webhook_type: webhookType,
      } = req.body;
      if (webhookType === "TRANSACTIONS") {
        // this is the only webhook code that needs to be handled, all others are irrelevant:
        // https://plaid.com/docs/api/products/transactions/#sync_updates_available
        if (webhookCode === "SYNC_UPDATES_AVAILABLE") {
          const {
            addedLength: added,
            modifiedLength: modified,
            removedLength: removed,
          } = await updateTransactions(plaidItemId);
          const { id } = await getItemsByPlaidItemId(plaidItemId);

          // TODO: send data to client via socket so client knows to refetch transactions
          console.log(
            `ITEM ${id} HAS ${added} NEW TRANSACTIONS, ${modified} MODIFIED TRANSACTIONS, AND ${removed} REMOVED TRANSACTIONS`
          );
        }
      } else if (webhookType === "ITEM") {
        // Handle item webhook
      } else {
        console.log(
          `Unhandled WEBHOOK TYPE: ${webhookType} WEBHOOK CODE: ${webhookCode}, for item ${plaidItemId}`
        );
      }
      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("ERROR HANDLING WEBHOOK", error);
      res.status(500);
    }
  },

  // ONLY USED DURING DEVELOPMENT MODE IN SANDBOX
  fireTestWebhook: async (req: Request, res: Response) => {
    try {
      const fireWebhookResponse = await plaidClient.sandboxItemFireWebhook({
        access_token: accessToken,
        webhook_code:
          SandboxItemFireWebhookRequestWebhookCodeEnum.NewAccountsAvailable,
        webhook_type: WebhookType.Item,
      });
      console.log(fireWebhookResponse.data);
      res.json(fireWebhookResponse.data);
    } catch (error) {
      console.error(error);
    }
  },
};
