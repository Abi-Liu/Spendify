import { Container, Title } from "@mantine/core";
import NetworthChart from "../components/graphs/NetworthChart";
import NoAccounts from "../components/NoAccounts";
import useAccountsContext from "../contexts/AccountsContext";
import AccountsTable from "../components/AccountsTable";
import { Helmet } from "react-helmet";

const NetworthPage = () => {
  const { accounts } = useAccountsContext();
  const accountsArray = Object.values(accounts);

  return (
    <>
      <Helmet>
        <title>Networth | BudgetBuddy</title>
        <meta
          name="description"
          content="Explore your financial growth with our Net Worth page. Track the value of your assets and liabilities, visualize your net worth over time, and make informed financial decisions. Our comprehensive insights empower you to build and optimize your financial portfolio. Start growing your net worth today."
        />
      </Helmet>
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
    </>
  );
};

export default NetworthPage;
