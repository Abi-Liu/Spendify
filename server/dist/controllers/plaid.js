"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plaid_1 = require("../config/plaid");
const plaid_2 = require("plaid");
const items_1 = require("../database/items");
const sanitize_1 = require("../utils/sanitize");
const updateTransactions_1 = require("../utils/updateTransactions");
// import { updateTransactions } from "../utils/updateTransactions";
const { CLIENT_URL } = process.env;
// only used for development. allows the local server to receive plaid webhooks
// must be changed to match each new ngrok url
const WEBHOOK_URL = "https://951e-2600-1700-a410-90b0-6868-2889-d439-3e05.ngrok-free.app/webhook/";
exports.default = {
    // start the link flow by sending client a public token.
    // They can then use that public token to request for an access token that will allow us to connect their accounts
    createLinkToken: async (request, response) => {
        //   Get the client_user_id by searching for the current user);
        const { id: clientUserId, itemId } = request.body;
        let accessToken = null;
        const products = [plaid_2.Products.Transactions];
        // if itemId exists, that means we are initializing link in update mode.
        // include the item access token and do not include any products
        if (itemId) {
            const item = await (0, items_1.getItemById)(itemId);
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
            country_codes: [plaid_2.CountryCode.Us],
            webhook: WEBHOOK_URL,
            access_token: accessToken,
        };
        try {
            const createTokenResponse = await plaid_1.plaidClient.linkTokenCreate(plaidRequest);
            response.status(200).json(createTokenResponse.data);
        }
        catch (error) {
            console.error(error.response.data);
            response.status(500).send("failure");
        }
    },
    // Exchange token flow - exchange a Link public_token for
    // an API access_token
    setAccessToken: async (req, res) => {
        const { publicToken, institutionId, userId } = req.body;
        try {
            const tokenResponse = await plaid_1.plaidClient.itemPublicTokenExchange({
                public_token: publicToken,
            });
            // store these in a database
            const accessToken = tokenResponse.data.access_token;
            const itemId = tokenResponse.data.item_id;
            // create the item
            const item = await (0, items_1.createItem)(userId, accessToken, itemId, institutionId);
            // fetch and store transactions
            await (0, updateTransactions_1.updateTransactions)(itemId);
            // notify the client that the transactions are ready to be fetched
            req.io.emit(`NEW_TRANSACTIONS_DATA_${userId}`, {
                itemId: item.id,
            });
            // potentially cache items here?
            res.status(200).json((0, sanitize_1.sanitizeItems)(item));
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Exchange Failed");
        }
    },
    testResetLogin: async (req, res) => {
        const { id: itemId } = req.body;
        const { plaid_access_token } = await (0, items_1.getItemById)(itemId);
        const config = {
            access_token: plaid_access_token,
        };
        const { data } = await plaid_1.plaidClient.sandboxItemResetLogin(config);
        console.log(data);
        res.status(200);
    },
};
//# sourceMappingURL=plaid.js.map