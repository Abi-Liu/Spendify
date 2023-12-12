import { useCallback, useEffect, useState } from "react";
import { Transactions } from "../contexts/TransactionsContext";
import { Table } from "@mantine/core";
import api from "../utils/axios";
import useUserContext from "../contexts/UserContext";
import Loading from "./Loading";
import formatCurrency from "../utils/formatDollar";

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

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  if (!transactions) {
    return <Loading />;
  }

  const rows = transactions.map((transaction) => (
    <Table.Tr key={transaction.id}>
      <Table.Td>{formatDate(transaction.date)}</Table.Td>
      <Table.Td>{transaction.name}</Table.Td>
      <Table.Td>{transaction.personal_finance_category}</Table.Td>
      <Table.Td>{transaction.payment_channel}</Table.Td>
      <Table.Td>{formatCurrency(Number(transaction.amount))}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Date</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Category</Table.Th>
          <Table.Th>Payment Channel</Table.Th>
          <Table.Th>Amount</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

export default TransactionsTable;
