import { useEffect, useState } from "react";
import { Transactions } from "../contexts/TransactionsContext";
import { Table } from "@mantine/core";
import api from "../utils/axios";
import useUserContext from "../contexts/UserContext";
import Loading from "./Loading";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transactions[]>();

  // used for table pagination. Default value of 1
  const [page, setPage] = useState(1);

  // used to determine how many transactions to show per page. Default value of 10
  const [limit, setLimit] = useState(10);

  const { user } = useUserContext();

  // on render, retrieve the first page of transactions.
  useEffect(() => {
    async function fetchPagination() {
      try {
        const { data } = await api.get(
          `/transactions/pagination?column=user_id&columnValue=${
            user!.id
          }&limit=${limit}&offset=${(page - 1) * limit}`
        );
        setTransactions(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPagination();
  }, [limit, page, user]);

  if (!transactions) {
    return <Loading />;
  }

  // column definitions
  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "personal_finance_category", header: "Category" },
    { accessorKey: "payment_channel", header: "Payment Channel" },
    { accessorKey: "amount", header: "Amount" },
  ];
  return <div>TransactionsTable</div>;
};

export default TransactionsTable;
