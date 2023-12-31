import { Suspense } from "react";
import { useEffect } from "react";
import useItemsContext from "../contexts/ItemsContext";
import useUserContext from "../contexts/UserContext";
import useAccountsContext from "../contexts/AccountsContext";
import useTransactionsContext from "../contexts/TransactionsContext";
import formatLastThreeMonths from "../utils/formatDates";
import Loading from "../components/Loading";
import SpendingAnalysis from "../components/SpendingAnalysis";
import NoAccounts from "../components/NoAccounts";
import useAssetsContext from "../contexts/AssetsContext";
import { Container, Group, Text } from "@mantine/core";
import NetworthChart from "../components/NetworthChart";
import { Link } from "react-router-dom";
import useNetworthContext from "../contexts/NetworthContext";
import formatCurrency from "../utils/formatDollar";

const Dashboard = () => {
  // change document title
  useEffect(() => {
    document.title = "Dashboard | BudgetBuddy";
  }, []);

  const { itemsArray, getItemsByUser } = useItemsContext();
  const { user } = useUserContext();
  const { getAccountsByUser } = useAccountsContext();
  const { getTransactionsByUserId } = useTransactionsContext();
  const { getUserAssets } = useAssetsContext();
  const { networth } = useNetworthContext();

  const currentNetworth = formatCurrency(
    Number(networth[new Date().toISOString().split("T")[0]])
  );

  // get all items for the user
  useEffect(() => {
    async function fetch() {
      if (user) {
        await getItemsByUser(user.id);
      }
    }
    fetch();
  }, [user, getItemsByUser]);

  // get all accounts associated with the user
  useEffect(() => {
    getAccountsByUser(user!.id);
  }, [user, getAccountsByUser]);

  // get transactions so we can break down the summary of spending. Only fetch first 3 months of transactions.
  // this will be used for budgeting and spending analysis. also comparing spending to previous month.
  useEffect(() => {
    // returns first day of 2 months ago and last day of the current month
    const { startDate, endDate } = formatLastThreeMonths();

    getTransactionsByUserId(user!.id, startDate, endDate);
  }, [getTransactionsByUserId, user]);

  // get all assets associated with the user
  useEffect(() => {
    getUserAssets(user!.id);
  }, [user, getUserAssets]);

  return (
    <Suspense fallback={<Loading />}>
      {itemsArray.length === 0 ? (
        <NoAccounts />
      ) : (
        <Container size="xl">
          <Container
            size="md"
            h={275}
            pb="2.5rem"
            style={{ border: "1px solid #808080" }}
          >
            <Group pt="1rem" justify="space-between" align="center">
              <Text size="1rem">
                <Link to="networth" style={{ color: "inherit" }}>
                  Networth
                </Link>
              </Text>
              <Text
                size="sm"
                c={Number(currentNetworth) > 0 ? "inherit" : "red"}
              >
                {currentNetworth}
              </Text>
            </Group>
            <NetworthChart />
          </Container>

          <SpendingAnalysis />
        </Container>
      )}
    </Suspense>
  );
};

export default Dashboard;
