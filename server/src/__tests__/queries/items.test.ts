import {
  getItemById,
  getItemsByPlaidItemId,
  updateItemCursor,
  createItem,
} from "../../database/items";
import { connection } from "../../index";

jest.mock("../../index", () => ({
  connection: {
    query: jest.fn(),
  },
}));

describe("Item Queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // test for createItem
  it("should create a new item", async () => {
    // mock insert data
    const userId: number = 1;
    const accessToken: string = "access_token";
    const itemId: string = "item_id";
    const institutionId: string = "ins_id";

    // mock insert and select response data
    const insertId = 123;
    const rows = [{ id: 1 }];

    (connection.query as jest.Mock)
      .mockResolvedValueOnce([[{ insertId }]])
      .mockResolvedValueOnce(rows);

    const res = await createItem(userId, accessToken, itemId, institutionId);

    expect(res).toEqual({ id: 1 });
    // Check if connection.query was called with the expected arguments
    expect(connection.query as jest.Mock).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO Plaid_Items (user_id, access_token, item_id, institution_id) VALUES (?, ?, ?, ?);",
      [userId, accessToken, itemId, institutionId]
    );

    expect(connection.query as jest.Mock).toHaveBeenNthCalledWith(
      2,
      "SELECT * FROM Plaid_Items WHERE id = ?",
      [rows[0].id]
    );
  });

  // test for getItemsByPlaidItemId

  // test for getItemById

  // test for updateItemCursor
});
