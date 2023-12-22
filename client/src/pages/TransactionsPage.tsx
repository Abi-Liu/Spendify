import { useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import useAccountsContext from "../contexts/AccountsContext";
import useInstitutionsContext from "../contexts/InstitutionsContext";
import NoAccounts from "../components/NoAccounts";

const TransactionsPage = () => {
  const [selectedAccount, setSelectedAccount] = useState<number | string>(
    "all"
  );
  const { accounts } = useAccountsContext();
  const { institutions } = useInstitutionsContext();

  let title;
  let subheading;
  if (selectedAccount == "all") {
    title = "All Accounts";
  } else {
    title =
      institutions.byItemId[accounts[Number(selectedAccount)].item_id].name;
    subheading = accounts[Number(selectedAccount)].name;
  }

  return (
    <Container size="xl">
      {Object.keys(accounts).length > 0 ? (
        <>
          <Title order={4} pt={10}>
            Transactions
          </Title>
          <Text size="lg" pt={5} pb={subheading ? "" : "2.5rem"} c="#6B6C71">
            {title}
          </Text>
          {subheading && (
            <Text size="md" pt={5} pb="2.5rem" c="#6B6C71">
              {subheading}
            </Text>
          )}

          <Group pb={20} gap={5}>
            <Button
              style={{
                background: selectedAccount == "all" ? "#D6D6D6" : "",
                color: selectedAccount == "all" ? "black" : "",
              }}
              onClick={() => setSelectedAccount("all")}
            >
              All
            </Button>
            {Object.values(accounts).map((account) => (
              <Button
                key={account.id}
                style={{
                  background: selectedAccount == account.id ? "#D6D6D6" : "",
                  color: selectedAccount == account.id ? "black" : "",
                }}
                onClick={() => setSelectedAccount(account.id)}
              >
                {account.name}
              </Button>
            ))}
          </Group>
          <TransactionsTable account={selectedAccount} />
        </>
      ) : (
        <NoAccounts />
      )}
    </Container>
  );
};

export default TransactionsPage;
