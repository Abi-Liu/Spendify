import { Suspense, useState } from "react";
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
import { Card, Container, Group, Modal, Text, em } from "@mantine/core";
import NetworthChart from "../components/graphs/NetworthChart";
import { Link } from "react-router-dom";
import useNetworthContext from "../contexts/NetworthContext";
import formatCurrency from "../utils/formatDollar";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import CredentialsModule from "../components/CredentialsModule";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  const [showCredentialsModule, setShowCredentialsModule] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { itemsArray, getItemsByUser } = useItemsContext();
  const { user } = useUserContext();
  const { getAccountsByUser } = useAccountsContext();
  const { getTransactionsByUserId } = useTransactionsContext();
  const { getUserAssets } = useAssetsContext();
  const { networth } = useNetworthContext();

  const currentNetworth = networth[new Date().toISOString().split("T")[0]];
  const isMedium = useMediaQuery(`(max-width: ${em(1050)})`);

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

  // informing users on how to connect to an institution when in sandbox mode
  useEffect(() => {
    if (import.meta.env.VITE_PLAID_ENV === "sandbox") {
      if (!localStorage.getItem("acknowledged")) {
        setShowCredentialsModule(true);
        localStorage.setItem("acknowledged", "true");
        open();
      }
    }
  }, [open]);

  return (
    <>
      <Helmet>
        <title>Dashboard | BudgetBuddy</title>
        <meta
          name="description"
          content="Effortlessly manage your finances from our intuitive dashboard. Link accounts seamlessly, gain insights into your monthly spending habits, and take control of your financial journey. Explore a comprehensive view of your financial health in one centralized hub. Start making informed financial decisions today."
        />
      </Helmet>

      <Suspense fallback={<Loading />}>
        {showCredentialsModule && (
          <Modal
            opened={opened}
            onClose={close}
            title="Getting started"
            centered
          >
            <CredentialsModule
              setShowCredentialsModule={setShowCredentialsModule}
            />
          </Modal>
        )}
        {itemsArray.length === 0 ? (
          <NoAccounts />
        ) : (
          <Container size="xl" mb="4rem">
            <Card
              withBorder
              shadow="lg"
              h={275}
              w={isMedium ? "95%" : "80%"}
              mx="auto"
              pb="2.5rem"
              mb="5rem"
              mt="2rem"
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
                  {formatCurrency(Number(currentNetworth))}
                </Text>
              </Group>
              <NetworthChart />
            </Card>

            <SpendingAnalysis />
          </Container>
        )}
      </Suspense>
    </>
  );
};

export default Dashboard;
