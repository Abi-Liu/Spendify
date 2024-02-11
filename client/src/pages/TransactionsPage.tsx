import { useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import useAccountsContext from "../contexts/AccountsContext";
import useInstitutionsContext from "../contexts/InstitutionsContext";
import NoAccounts from "../components/NoAccounts";
import { usePaginatedTransactions } from "../hooks/useTransactionHooks";
import useUserContext from "../contexts/UserContext";
import CSV from "../components/CSV";
import LimitSelector from "../components/LimitSelector";
import Pagination from "../components/Pagination";
import { Helmet } from "react-helmet";

const TransactionsPage = () => {
  const [selectedAccount, setSelectedAccount] = useState<number | string>(
    "all"
  );
  // used for table pagination. Default value of 1
  const [page, setPage] = useState(1);

  // used to determine how many transactions to show per page. Default value of 25
  const [limit, setLimit] = useState(25);

  const { accounts } = useAccountsContext();
  const { institutions } = useInstitutionsContext();
  const { user } = useUserContext();
  // get paginated transactions
  const { transactions, hasNextPage } = usePaginatedTransactions(
    selectedAccount,
    page,
    limit,
    user!.id
  );

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
    <>
      <Helmet>
        <title>Transactions | BudgetBuddy</title>
        <meta
          name="description"
          content="Effortlessly track and categorize your financial transactions on our Transactions page. Gain a detailed overview of your spending history, identify patterns, and stay in control of your money. Simplify your financial tracking experience and make informed decisions. Start managing your transactions with ease."
        />
      </Helmet>

      <Container size="xl">
        {Object.keys(accounts).length > 0 ? (
          <>
            <Title order={2} pt={10}>
              Transactions
            </Title>
            <Text size="lg" pt={5} pb={subheading ? "" : "2.5rem"} c="dimmed">
              {title}
            </Text>
            {subheading && (
              <Text size="md" pt={5} pb="2.5rem" c="dimmed">
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
            <TransactionsTable transactions={transactions} />
            <Group p="md" justify="space-between">
              <Group>
                <Text size="xs">Showing</Text>
                <LimitSelector
                  limit={limit}
                  setLimit={setLimit}
                  optionsArray={["25", "50", "100"]}
                />
                <CSV transactions={transactions} />
              </Group>
              <Pagination
                hasNextPage={hasNextPage}
                page={page}
                setPage={setPage}
              />
            </Group>
          </>
        ) : (
          <NoAccounts />
        )}
      </Container>
    </>
  );
};

export default TransactionsPage;
