import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import {
  SandboxItemFireWebhookRequestWebhookCodeEnum,
  WebhookType,
} from "plaid";

// using for testing purposes
const accessToken = "access-sandbox-966460a7-f1b2-4668-b5a2-cbfdf6e8036d";

export default {
  // handleWebhook: async (req: Request, res: Response) => {

  // },

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
