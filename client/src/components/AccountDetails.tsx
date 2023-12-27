import { Accordion, Flex, Text } from "@mantine/core";
import { Account } from "../contexts/AccountsContext";

const AccountDetails = ({ account }: { account: Account }) => {
  return (
    <Accordion.Panel>
      <Flex justify="space-between">
        <Text size="sm" fw={400}>
          {account.name}
        </Text>
        <Text size="sm" fw={400}>
          {Number(account.current_balance).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
      </Flex>
      <Flex justify="space-between">
        <Text size="xs" c="dimmed" fw={500}>
          {account.official_name}
        </Text>
      </Flex>
    </Accordion.Panel>
  );
};

export default AccountDetails;
