"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plaidClient = void 0;
const plaid_1 = require("plaid");
const { PLAID_ENV, PLAID_CLIENT_ID, PLAID_SECRET } = process.env;
const configuration = new plaid_1.Configuration({
    basePath: plaid_1.PlaidEnvironments[PLAID_ENV],
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
            "PLAID-SECRET": PLAID_SECRET,
            "Plaid-Version": "2020-09-14",
        },
    },
});
exports.plaidClient = new plaid_1.PlaidApi(configuration);
//# sourceMappingURL=plaid.js.map