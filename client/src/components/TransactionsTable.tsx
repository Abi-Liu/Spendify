import { useCallback, useEffect, useMemo, useState } from "react";
import { Transactions } from "../contexts/TransactionsContext";
import {
  Group,
  Table,
  Text,
  Combobox,
  useCombobox,
  InputBase,
  Button,
} from "@mantine/core";
import api from "../utils/axios";
import useUserContext from "../contexts/UserContext";
import Loading from "./Loading";
import formatCurrency from "../utils/formatDollar";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";
import { CSVLink } from "react-csv";

interface TransactionsTableProps {
  account: string | number;
}

const TransactionsTable = (props: TransactionsTableProps) => {
  const { user } = useUserContext();
  const [transactions, setTransactions] = useState<Transactions[]>();
  // used for table pagination. Default value of 1
  const [page, setPage] = useState(1);

  // used to determine how many transactions to show per page. Default value of 25
  const [limit, setLimit] = useState(25);

  // determine if we are querying from all accounts or specific accounts and the id of the row we want to get
  // refactored to useMemo instead of state to minimize rerenders
  const column = useMemo(() => {
    if (typeof props.account === "number") {
      return "account_id";
    } else {
      return "user_id";
    }
  }, [props.account]);

  const columnValue = useMemo(() => {
    if (typeof props.account === "number") {
      return props.account;
    } else {
      return user!.id;
    }
  }, [props.account, user]);

  // on render, retrieve the first page of transactions.
  useEffect(() => {
    async function fetchPagination() {
      try {
        const { data } = await api.get(
          `/transactions/pagination?column=${column}&columnValue=${columnValue}&limit=${limit}&offset=${
            (page - 1) * limit
          }`
        );
        setTransactions(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPagination();
  }, [limit, page, user, column, columnValue]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  function nextPage() {
    setPage((prev) => prev + 1);
  }

  function previousPage() {
    setPage((prev) => prev - 1);
  }

  // COMBO BOX
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const optionsArray = ["25", "50", "100"];

  const options = optionsArray.map((option) => (
    <Combobox.Option value={option} key={option}>
      {option}
    </Combobox.Option>
  ));

  const { csvData, headers } = useMemo(() => {
    if (transactions?.length) {
      const headers = [
        { label: "Date", key: "date" },
        { label: "Name", key: "name" },
        { label: "Category", key: "category" },
        { label: "Payment Channel", key: "payment_channel" },
        { label: "Amount", key: "amount" },
      ];
      const csvData = [];
      for (const transaction of transactions) {
        csvData.push({
          date: transaction.date,
          name: transaction.name,
          category: transaction.personal_finance_category,
          payment_channel: transaction.payment_channel,
          amount: formatCurrency(transaction.amount),
        });
      }
      return { csvData, headers };
    }
    return { csvData: "" };
  }, [transactions]);

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

      <Group p="md" justify="space-between">
        <Group>
          <Text size="xs">Showing</Text>
          <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
              setLimit(Number(val));
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents="none"
                onClick={() => combobox.toggleDropdown()}
              >
                {limit}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
          <CSVLink
            data={csvData}
            headers={headers}
            filename="Transactions"
            target="_blank"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Export to CSV
          </CSVLink>
        </Group>
        {/* pagination */}
        <Group>
          <Button
            variant="transparent"
            color="gray"
            onClick={previousPage}
            disabled={page === 1}
          >
            <TbArrowLeft />
          </Button>
          <Text size="sm">{page}</Text>
          <Button
            variant="transparent"
            color="gray"
            onClick={nextPage}
            disabled={transactions.length < limit}
          >
            <TbArrowRight />
          </Button>
        </Group>
      </Group>
    </>
  );
};

export default TransactionsTable;
