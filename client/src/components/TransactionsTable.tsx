import { Table, Text } from "@mantine/core";
import Loading from "./Loading";
import formatCurrency from "../utils/formatDollar";
import { Transactions } from "../contexts/TransactionsContext";

interface TransactionsTableProps {
  transactions: Transactions[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  if (!transactions) {
    return <Loading />;
  }

  const rows = transactions.map((transaction) => (
    <Table.Tr key={transaction.id}>
      <Table.Td>{formatDate(transaction.date.split("T")[0])}</Table.Td>
      <Table.Td>{transaction.name}</Table.Td>
      <Table.Td>{transaction.personal_finance_category}</Table.Td>
      <Table.Td>{transaction.payment_channel}</Table.Td>
      <Table.Td>{formatCurrency(Number(transaction.amount))}</Table.Td>
    </Table.Tr>
  ));

  if (transactions.length === 0) {
    return <Text size="lg">No Transactions Found</Text>;
  }

  return (
    <>
      <Table.ScrollContainer minWidth={650}>
        <Table striped withTableBorder>
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
      </Table.ScrollContainer>
    </>
  );
};

export default TransactionsTable;
