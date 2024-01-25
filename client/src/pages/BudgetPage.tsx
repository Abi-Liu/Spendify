import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import useBudgetsContext from "../contexts/BudgetsContext";
import useItemsContext from "../contexts/ItemsContext";
import NoAccounts from "../components/NoAccounts";
import {
  Button,
  Container,
  Text,
  Modal,
  Table,
  Flex,
  Divider,
  em,
  Title,
  NumberInput,
  Group,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import useUserContext from "../contexts/UserContext";
import { notifications } from "@mantine/notifications";
import BudgetChart from "../components/BudgetChart";
import useTransactionsContext, {
  Transactions,
} from "../contexts/TransactionsContext";
import DailySpendingChart from "../components/DailySpendingChart";
import formatCurrency from "../utils/formatDollar";
import { TbPencilCog } from "react-icons/tb";

interface CustomFormProps {
  close: () => void;
}
const CustomForm = ({ close }: CustomFormProps) => {
  const [amount, setAmount] = useState<number | string>("");

  const { budgets, createBudget } = useBudgetsContext();
  const { user } = useUserContext();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const existingBudget = Object.values(budgets)[0];
    if (user && typeof amount === "number") {
      if (existingBudget) {
        createBudget(user.id, amount);

        notifications.show({
          message: `Budget updated!`,
          color: "green",
        });

        // close modal
        close();
      } else {
        createBudget(user.id, amount);
        // TODO: have better error handling, do not show success message if an error occurs
        // show success message
        notifications.show({
          message: `Budget successfully created`,
          color: "green",
        });

        // close modal
        close();
      }
    } else {
      // user will always be defined so if we get into this block
      // that means the user has tried to submit an empty input
      notifications.show({
        title: `Amount can not be empty`,
        message: "Please enter a valid amount",
        color: "red",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <NumberInput
        label="Amount"
        placeholder="eg 100"
        inputMode="numeric"
        allowNegative={false}
        decimalScale={2}
        thousandSeparator=","
        hideControls
        value={amount}
        onChange={setAmount}
      />
      <Button type="submit" my="1rem">
        Set
      </Button>
    </form>
  );
};

const BudgetPage = () => {
  // change document title
  useEffect(() => {
    document.title = "Budgeting | BudgetBuddy";
  }, []);

  const [opened, { open, close }] = useDisclosure(false);
  const { budgets, getBudgetByUser } = useBudgetsContext();
  const { itemsArray } = useItemsContext();
  const { user } = useUserContext();
  const { transactions } = useTransactionsContext();

  // used to display graph of daily spending in the current month
  const { spendingPerDay, filteredTransactions } = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const filteredTransactions = Object.values(transactions).filter(
      (transaction) => {
        const transactionDate = new Date(transaction.date);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth() + 1;

        return (
          transactionYear === currentYear && transactionMonth === currentMonth
        );
      }
    );
    // get the spending per day for the current month
    const spendingPerDay = filteredTransactions.reduce(
      (acc: { [day: number]: number }, transaction: Transactions) => {
        const transactionDate = new Date(transaction.date);
        const day = transactionDate.getDate();

        if (!acc[day]) {
          acc[day] = 0;
        }

        acc[day] += Number(transaction.amount);

        return acc;
      },
      {}
    );

    return { spendingPerDay, filteredTransactions };
  }, [transactions]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const breakpoint = useMediaQuery(`(max-width: ${em(1050)})`);

  useEffect(() => {
    if (user) {
      getBudgetByUser(user.id);
    }
  }, [user, getBudgetByUser]);

  if (itemsArray.length === 0) {
    return <NoAccounts />;
  } else if (Object.keys(budgets).length === 0) {
    return (
      // FINISH STYLING CREATE BUDGET PAGE
      <Container size="xl">
        <Modal opened={opened} onClose={close} title="Monthly Budget" centered>
          <CustomForm close={close} />
        </Modal>
        <Text size="1.25rem" pb={"1rem"}>
          No monthly budget
        </Text>
        <Text size="1rem">
          Create a monthly budget to keep your track of your spending.
        </Text>
        <Button my="1rem" onClick={open}>
          Create Budget
        </Button>
      </Container>
    );
  }

  const rows =
    filteredTransactions.length > 0 ? (
      filteredTransactions.map((transaction) => (
        <Table.Tr key={transaction.id}>
          <Table.Td>{formatDate(transaction.date)}</Table.Td>
          <Table.Td>{transaction.name}</Table.Td>
          <Table.Td>{transaction.personal_finance_category}</Table.Td>
          <Table.Td>{transaction.payment_channel}</Table.Td>
          <Table.Td>{formatCurrency(Number(transaction.amount))}</Table.Td>
        </Table.Tr>
      ))
    ) : (
      <Text>No transactions found for this month.</Text>
    );

  return (
    <Container size="xl" style={{ height: "100vh", marginTop: "1rem" }}>
      <Modal opened={opened} onClose={close} title="Monthly Budget" centered>
        <CustomForm close={close} />
      </Modal>
      <Group align="flex-end" gap={4}>
        <Title order={2}>Budgeting</Title>
        <Tooltip label="Edit budget">
          <ActionIcon variant="subtle" c="inherit" onClick={open}>
            <TbPencilCog />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Flex
        direction={breakpoint ? "column" : "row"}
        justify="space-between"
        style={{ height: breakpoint ? "700px" : "350px" }}
      >
        <BudgetChart />
        <DailySpendingChart spendingPerDay={spendingPerDay} />
      </Flex>

      <Divider mt={"1.25rem"} mb={"2rem"} />

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
    </Container>
  );
};

export default BudgetPage;
