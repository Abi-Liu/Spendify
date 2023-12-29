import { Container } from "@mantine/core";
import NetworthChart from "../components/NetworthChart";
import useAccountsContext from "../contexts/AccountsContext";
import NoAccounts from "../components/NoAccounts";

const NetworthPage = () => {
  const { accounts } = useAccountsContext();

  const accountsArray = Object.values(accounts);

  if (accountsArray.length === 0) {
    return <NoAccounts />;
  }

  return (
    <Container size="xl">
      <Container size="xl" h="350px">
        <NetworthChart />
      </Container>
    </Container>
  );
};

export default NetworthPage;
