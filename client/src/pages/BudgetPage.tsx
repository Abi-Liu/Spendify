import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import useBudgetsContext from "../contexts/BudgetsContext";
import useItemsContext from "../contexts/ItemsContext";
import NoAccounts from "../components/NoAccounts";
import { Button, Container, Text, Modal, Input, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useUserContext from "../contexts/UserContext";
import { notifications } from "@mantine/notifications";
import BudgetChart from "../components/BudgetChart";
import useTransactionsContext, {
  Transactions,
} from "../contexts/TransactionsContext";
import DailySpendingChart from "../components/DailySpendingChart";

const CustomForm = () => {
  const [amount, setAmount] = useState<number | "">("");

  const { createBudget } = useBudgetsContext();
  const { user } = useUserContext();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    if (/^\d*$/.test(value) || value === "") {
      setAmount(value === "" ? "" : parseInt(value)); // Convert valid input to a number
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user && typeof amount === "number") {
      createBudget(user.id, amount);
      // TODO: have better error handling, do not show success message if an error occurs
      // show success message
      notifications.show({
        message: `Budget successfully created`,
        color: "green",
      });
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
      <Input.Wrapper label="Amount">
        <Input
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={handleChange}
          placeholder="e.g 100"
        />
      </Input.Wrapper>
      <Button type="submit" my="1rem">
        Create
      </Button>
    </form>
  );
};

const BudgetPage = () => {
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

  console.log(spendingPerDay);

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
        <Text size="1.25rem" pb={"1rem"}>
          No monthly budget
        </Text>
        <Text size="1rem">
          Create a monthly budget to keep your track of your spending.
        </Text>
        <Modal opened={opened} onClose={close} title="Monthly Budget">
          <CustomForm />
        </Modal>
        <Button my="1rem" onClick={open}>
          Create Budget
        </Button>
      </Container>
    );
  }

  return (
    <Container style={{ height: "100vh" }}>
      <Box style={{ height: "350px" }}>
        <BudgetChart />
        <DailySpendingChart spendingPerDay={spendingPerDay} />
      </Box>
    </Container>
  );
};

export default BudgetPage;
