import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useBudgetsContext from "../contexts/BudgetsContext";
import useItemsContext from "../contexts/ItemsContext";
import NoAccounts from "../components/NoAccounts";
import { Button, Container, Text, Modal, Input, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useUserContext from "../contexts/UserContext";
import { notifications } from "@mantine/notifications";
import BudgetChart from "../components/BudgetChart";

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
      </Box>
    </Container>
  );
};

export default BudgetPage;
