import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import { CountryCode, Products } from "plaid";
import { createItem } from "../database/items";
import { sanitizeItems } from "../utils/sanitize";
import { updateTransactions } from "../utils/updateTransactions";
import SocketRequest from "src/interfaces/SocketRequest";
// import { updateTransactions } from "../utils/updateTransactions";

const { CLIENT_URL } = process.env;

// only used for development. allows the local server to receive plaid webhooks
// must be changed to match each new ngrok url
const WEBHOOK_URL =
  "https://f56f-2600-1700-a410-90b0-e0a4-8a4c-bff2-1d40.ngrok-free.app/webhook";

export default {
  // start the link flow by sending client a public token.
  // They can then use that public token to request for an access token that will allow us to connect their accounts
  createLinkToken: async (request: Request, response: Response) => {
    //   Get the client_user_id by searching for the current user);
    const clientUserId = request.body.id;

    // Configuring plaid request
    const plaidRequest = {
      user: {
        client_user_id: clientUserId,
      },
      client_name: "BudgetBuddy",
      products: [Products.Transactions],
      language: "en",
      redirect_uri: CLIENT_URL,
      country_codes: [CountryCode.Us],
      webhook: WEBHOOK_URL,
    };
    try {
      const createTokenResponse = await plaidClient.linkTokenCreate(
        plaidRequest
      );
      response.status(200).json(createTokenResponse.data);
    } catch (error) {
      console.error(error.response.data);
      response.status(500).send("failure");
    }
  },
  // Exchange token flow - exchange a Link public_token for
  // an API access_token
  setAccessToken: async (req: SocketRequest, res: Response) => {
    const { publicToken, institutionId, userId } = req.body;

    try {
      const tokenResponse = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      // store these in a database
      const accessToken = tokenResponse.data.access_token;
      const itemId = tokenResponse.data.item_id;
      // create the item
      const item = await createItem(userId, accessToken, itemId, institutionId);

      // fetch and store transactions
      await updateTransactions(itemId);

      // notify the client that the transactions are ready to be fetched
      req.io.emit("NEW_TRANSACTIONS_DATA", { itemId: item.id });

      // potentially cache items here?

      res.status(200).json(sanitizeItems(item));
    } catch (error) {
      console.log(error);
      res.status(500).send("Exchange Failed");
    }
  },
};
