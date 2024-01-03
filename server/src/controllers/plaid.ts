import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import { CountryCode, Products } from "plaid";
import { createItem, getItemById } from "../database/items";
import { sanitizeItems } from "../utils/sanitize";
import { updateTransactions } from "../utils/updateTransactions";
import SocketRequest from "../interfaces/SocketRequest";
// import { updateTransactions } from "../utils/updateTransactions";

const { CLIENT_URL } = process.env;

// only used for development. allows the local server to receive plaid webhooks
// must be changed to match each new ngrok url
const WEBHOOK_URL =
  "https://951e-2600-1700-a410-90b0-6868-2889-d439-3e05.ngrok-free.app/webhook/";

export default {
  // start the link flow by sending client a public token.
  // They can then use that public token to request for an access token that will allow us to connect their accounts
  createLinkToken: async (request: Request, response: Response) => {
    //   Get the client_user_id by searching for the current user);
    const { id: clientUserId, itemId } = request.body;

    let accessToken = null;
    const products = [Products.Transactions];

    // if itemId exists, that means we are initializing link in update mode.
    // include the item access token and do not include any products
    if (itemId) {
      const item = await getItemById(itemId);
      accessToken = item.plaid_access_token;
    }

    // Configuring plaid request
    const plaidRequest = {
      user: {
        client_user_id: String(clientUserId),
      },
      client_name: "BudgetBuddy",
      products,
      language: "en",
      redirect_uri: CLIENT_URL,
      country_codes: [CountryCode.Us],
      webhook: WEBHOOK_URL,
      access_token: accessToken,
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
      req.io.emit(`NEW_TRANSACTIONS_DATA_${userId}`, {
        itemId: item.id,
      });

      // potentially cache items here?

      res.status(200).json(sanitizeItems(item));
    } catch (error) {
      console.log(error);
      res.status(500).send("Exchange Failed");
    }
  },

  testResetLogin: async (req: Request, res: Response) => {
    const { id: itemId } = req.body;

    const { plaid_access_token } = await getItemById(itemId);

    const config = {
      access_token: plaid_access_token,
    };

    const { data } = await plaidClient.sandboxItemResetLogin(config);
    console.log(data);
    res.status(200);
  },
};
