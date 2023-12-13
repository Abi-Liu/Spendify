import { useCallback, useEffect, useState } from "react";
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

interface TransactionsTableProps {
  account: string | number;
}

const TransactionsTable = (props: TransactionsTableProps) => {
  const [transactions, setTransactions] = useState<Transactions[]>();
  const [column, setColumn] = useState("user_id");

  // used for table pagination. Default value of 1
  const [page, setPage] = useState(1);

  // used to determine how many transactions to show per page. Default value of 25
  const [limit, setLimit] = useState(25);

  const { user } = useUserContext();

  // it will determine if we are querying from all accounts or specific accounts
  useEffect(() => {
    if (typeof props.account === "string") {
      setColumn("account_id");
    } else {
      setColumn("user_id");
    }
  }, [props.account]);

  // on render, retrieve the first page of transactions.
  useEffect(() => {
    async function fetchPagination() {
      try {
        const { data } = await api.get(
          `/transactions/pagination?column=${column}&columnValue=${
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
