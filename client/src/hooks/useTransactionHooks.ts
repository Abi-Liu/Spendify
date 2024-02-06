import { useEffect, useState } from "react";
import { Transactions } from "../contexts/TransactionsContext";
import api from "../utils/axios";

export function usePaginatedTransactions(
  account: string | number,
  page: number,
  limit: number,
  userId: number
) {
  const [transactions, setTransactions] = useState<Transactions[]>();
  const [hasNextPage, setHasNextPage] = useState(true);

  // determine if we are querying from all accounts or specific accounts and the id of the row we want to get
  const { column, columnValue } =
    typeof account === "number"
      ? { column: "account_id", columnValue: account }
      : { column: "user_id", columnValue: userId };

  useEffect(() => {
    async function fetchPagination() {
      try {
        const { data } = await api.get(
          `/transactions/pagination?column=${column}&columnValue=${columnValue}&limit=${limit}&offset=${
            (page - 1) * limit
          }`
        );
        setTransactions(data.transactions);
        setHasNextPage(data.nextPage);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPagination();
  }, [limit, page, column, columnValue]);

  return { transactions, hasNextPage };
}
