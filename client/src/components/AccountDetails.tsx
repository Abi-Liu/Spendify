import React from "react";
import { Accordion, Flex, Text } from "@mantine/core";
import { Account } from "../contexts/AccountsContext";

const AccountDetails = ({ account }: { account: Account }) => {
  // format the time so we can let the user's know how fresh the data is
  const date = new Date(account.updated_at);

  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();

  // Calculate hours from milliseconds
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));

  let updatedTime = "";
  if (hours === 0) {
    updatedTime = `Updated < 1 hour ago`;
  } else if (hours === 1) {
    updatedTime = `Updated 1 hour ago`;
  } else {
    updatedTime = `Updated ${hours} hours ago`;
  }

  const formattedTimeDifference = `updated ${hours} hours ago`;

  return (
    <Accordion.Panel>
      <Flex justify="space-between">
        <Text size="sm">{account.name}</Text>
        <Text size="sm">
          {Number(account.available_balance).toLocaleString("en-US", {
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
