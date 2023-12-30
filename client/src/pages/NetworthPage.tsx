import { Container, Title } from "@mantine/core";
import NetworthChart from "../components/NetworthChart";
import NoAccounts from "../components/NoAccounts";
import useAccountsContext from "../contexts/AccountsContext";
import AccountsTable from "../components/AccountsTable";
import { useEffect } from "react";

const NetworthPage = () => {
  // set title of the page
  useEffect(() => {
    document.title = "Networth | BudgetBuddy";
  }, []);

  const { accounts } = useAccountsContext();
  const accountsArray = Object.values(accounts);

  return (
    <Container size="xl">
      {accountsArray.length === 0 ? (
        <NoAccounts />
      ) : (
        <>
          <Title order={2} pt={10}>
            Networth
          </Title>
          <Container size="xl" h="350px">
            <NetworthChart />
          </Container>
          <Container size="xl">
            <AccountsTable accountsArray={accountsArray} />
          </Container>
        </>
      )}
    </Container>
  );
};

export default NetworthPage;
