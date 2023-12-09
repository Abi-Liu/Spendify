import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import {
  SandboxItemFireWebhookRequestWebhookCodeEnum,
  WebhookType,
} from "plaid";
import { updateTransactions } from "../utils/updateTransactions";
import {
  getItemById,
  getItemsByPlaidItemId,
  setItemStatus,
} from "../database/items";
import SocketRequest from "../interfaces/SocketRequest";

// using for testing purposes
const accessToken = "access-sandbox-966460a7-f1b2-4668-b5a2-cbfdf6e8036d";

export default {
  handleWebhook: async (req: SocketRequest, res: Response) => {
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

          console.log(
            `ITEM ${id} HAS ${added} NEW TRANSACTIONS, ${modified} MODIFIED TRANSACTIONS, AND ${removed} REMOVED TRANSACTIONS`
          );

          // send data to client via socket so client knows to refetch transactions
          req.io.emit("SYNC_UPDATES_AVAILABLE", { id });
        }
      } else if (webhookType === "ITEM") {
        if (webhookCode === "PENDING_EXPIRATION") {
          const { id } = await getItemsByPlaidItemId(plaidItemId);
          // SET ITEM STATUS TO BAD
          await setItemStatus(id, "bad");
          console.log(`ITEM ${id} NEEDS TO BE REAUTHENTICATED`);
          req.io.emit("PENDING_EXPIRATION", id);
        }
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

  resetLogin: async (req: Request, res: Response) => {
    const { id: itemId } = req.body;
    const { access_token: accessToken } = await getItemById(itemId);
    const response = plaidClient.sandboxItemResetLogin({
      access_token: accessToken,
    });

    const ptResponse = await plaidClient.itemCreatePublicToken({
      access_token: accessToken,
    });
    const { public_token: publicToken } = ptResponse.data;
    console.log("Public Token: ", publicToken);
  },
};
