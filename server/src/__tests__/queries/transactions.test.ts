/* eslint-disable @typescript-eslint/no-explicit-any */

import { Transaction } from "plaid";
import {
  createOrUpdateTransactions,
  deleteTransactions,
  getItemTransactionsFromDates,
  getAccountTransactionsFromDates,
} from "../../database/transactions"; // Update the path to your transactions file
import { getAccountByPlaidAccountId } from "../../database/accounts";
import { getItemById } from "../../database/items";
import { connection } from "../../index"; // Update the path to your connection file
import { mockAddedTransactionData } from "../mocks/mockTransactionData";

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
});
