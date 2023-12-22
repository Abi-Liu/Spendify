import React, { useState } from "react";
import useBudgetsContext from "../contexts/BudgetsContext";
import useItemsContext from "../contexts/ItemsContext";
import NoAccounts from "../components/NoAccounts";
import { Button, Container, Text, Modal, Input } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const BudgetPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [amount, setAmount] = useState(0);
  const { budgets } = useBudgetsContext();
  const { itemsArray } = useItemsContext();

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
          Create a monthly budget to keep your expenses in check!
        </Text>
        <Modal opened={opened} onClose={close} title="Monthly Budget">
          <form>
            <Input placeholder="e.g 100" />
            <Button my="1rem">Create</Button>
          </form>
        </Modal>
        <Button onClick={open}>Create Budget</Button>
      </Container>
    );
  }
  return <div>BudgetPage</div>;
};

export default BudgetPage;
