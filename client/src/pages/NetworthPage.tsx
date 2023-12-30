import { Container } from "@mantine/core";
import NetworthChart from "../components/NetworthChart";
import NoAccounts from "../components/NoAccounts";
import useAccountsContext from "../contexts/AccountsContext";
import AccountsTable from "../components/AccountsTable";

const NetworthPage = () => {
  const { accounts } = useAccountsContext();
  const accountsArray = Object.values(accounts);

  return (
    <Container size="xl">
      {accountsArray.length === 0 ? (
        <NoAccounts />
      ) : (
        <>
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
