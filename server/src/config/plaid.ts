import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const { PLAID_ENV, PLAID_CLIENT_ID, PLAID_SECRET } = process.env;

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV as string],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
