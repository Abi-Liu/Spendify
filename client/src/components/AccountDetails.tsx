import React from "react";
import { Accordion, Flex, Text } from "@mantine/core";
import { Account } from "../contexts/AccountsContext";

const AccountDetails = ({ account }: { account: Account }) => {
  return (
    <Accordion.Panel>
      <Flex justify="space-between">
        <Text size="sm" fw={500}>
          {account.name}
        </Text>
        <Text size="sm" fw={500}>
          {Number(account.current_balance).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
      </Flex>
      <Flex justify="space-between">
        <Text size="xs">{account.official_name}</Text>
      </Flex>
    </Accordion.Panel>
  );
};

export default AccountDetails;
