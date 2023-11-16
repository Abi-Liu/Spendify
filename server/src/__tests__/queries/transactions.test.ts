/* eslint-disable @typescript-eslint/no-explicit-any */

import { Transaction } from "plaid";
import {
  createOrUpdateTransactions,
  deleteTransactions,
  getItemTransactionsFromDates,
} from "../../database/transactions"; // Update the path to your transactions file
import { getAccountByPlaidAccountId } from "../../database/accounts";
import { getItemById } from "../../database/items";
import { connection } from "../../index"; // Update the path to your connection file
import {
  mockAddedTransactionData,
  mockRemovedTransactionData,
} from "../mocks/mockTransactionData";

// Mock the connection.query function to avoid actual database calls in tests
jest.mock("../../index", () => ({
  connection: {
    query: jest.fn(),
  },
}));

jest.mock("../../database/accounts", () => ({
  getAccountByPlaidAccountId: jest.fn(),
}));

jest.mock("../../database/items", () => ({
  getItemById: jest.fn(),
}));

describe.only("Transactions Queries", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function calls before each test
  });

  // Mock the functions from accounts.ts and items.ts

  it("should create or update transactions", async () => {
    // Mock data for testing
    const addedTransactions: Transaction[] = mockAddedTransactionData;
    const modifiedTransactions: any = [];

    (getAccountByPlaidAccountId as jest.Mock).mockResolvedValue({
      id: 1,
      item_id: "item_id",
    });
    (getItemById as jest.Mock).mockResolvedValue({
      id: 2,
      item_id: "plaid_item_id",
    });
    (connection.query as jest.Mock).mockResolvedValueOnce(null);

    await createOrUpdateTransactions(addedTransactions, modifiedTransactions);

    // Check if connection.query was called with the expected arguments
    expect(connection.query).toHaveBeenCalledTimes(2);
    expect(getAccountByPlaidAccountId).toHaveBeenCalledTimes(2);
    expect(getItemById).toHaveBeenCalledTimes(2);
  });

  it("should delete transactions", async () => {
    // Mock data for testing
    const removedTransactions = mockRemovedTransactionData;

    await deleteTransactions(removedTransactions);

    expect(connection.query).toHaveBeenCalledTimes(1);
  });

  it("should get item transactions from dates", async () => {
    // Mock data for testing
    const start = "2022-12-01";
    const end = "2023-12-01";
    const itemId = "item_id";

    // Mock the expected database response for the query
    connection.query.mockResolvedValue([
      [
        {
          id: 1000,
          account_id: 129,
          plaid_transaction_id: "W33lVgpkMDUpz6Ken4WGH1ope7VAPnI6VmZnX",
          personal_finance_category: "GENERAL_MERCHANDISE",
          payment_channel: "other",
          name: "CD DEPOSIT .INITIAL.",
          amount: 1000.0,
          iso_currency_code: "USD",
          unofficial_currency_code: null,
          date: "2023-02-28",
          pending: false,
          account_owner: null,
          created_at: "2023-11-15 17:59:50",
          updated_at: "2023-11-15 17:59:50",
          plaid_account_id: "wvvyw9xqlmfqRyD6drABSnwrWb5GpLiPwZene",
          item_id: 38,
          plaid_item_id: "Zaar6DpBMWtByQxJrDw1FgqP94DxMWTe4ZDLB",
        },
      ],
    ]);

    const result = await getItemTransactionsFromDates(start, end, itemId);

    // Check if connection.query was called with the expected arguments
    expect(connection.query).toHaveBeenCalledWith(
      "SELECT * FROM Transactions WHERE plaid_item_id = ? AND date BETWEEN ? AND ?",
      [itemId, start, end]
    );
    // Add more detailed expectations based on your specific implementation
    expect(result).toEqual([
      {
        id: 1000,
        account_id: 129,
        plaid_transaction_id: "W33lVgpkMDUpz6Ken4WGH1ope7VAPnI6VmZnX",
        personal_finance_category: "GENERAL_MERCHANDISE",
        payment_channel: "other",
        name: "CD DEPOSIT .INITIAL.",
        amount: 1000.0,
        iso_currency_code: "USD",
        unofficial_currency_code: null,
        date: "2023-02-28",
        pending: false,
        account_owner: null,
        created_at: "2023-11-15 17:59:50",
        updated_at: "2023-11-15 17:59:50",
        plaid_account_id: "wvvyw9xqlmfqRyD6drABSnwrWb5GpLiPwZene",
        item_id: 38,
        plaid_item_id: "Zaar6DpBMWtByQxJrDw1FgqP94DxMWTe4ZDLB",
      },
    ]);
  });
});
