import { useEffect } from "react";
import { io } from "socket.io-client";
import useTransactionsContext from "../contexts/TransactionsContext";
import useAccountsContext from "../contexts/AccountsContext";
import formatLastThreeMonths from "../utils/formatDates";
import { notifications } from "@mantine/notifications";
import useInstitutionsContext from "../contexts/InstitutionsContext";
import useLinkContext from "../contexts/LinkTokenContext";
import useUserContext from "../contexts/UserContext";
import useItemsContext from "../contexts/ItemsContext";

const Sockets = () => {
  const { getTransactionsByItemId } = useTransactionsContext();
  const { getAccountsByItemId } = useAccountsContext();
  const { getItemById } = useItemsContext();
  const { institutions, getInstitutionById } = useInstitutionsContext();
  const { user } = useUserContext();
  const { generateItemLinkToken } = useLinkContext();

  useEffect(() => {
    const socket = io("http://localhost:8000");
    // TRANSACTIONS WEBHOOKS
    socket.on("SYNC_UPDATES_AVAILABLE", ({ id }) => {
      console.log("NEW TRANSACTIONS FOR ITEM: ", id);

      // fetch new transactions data. Only fetching last 3 months.
      const { startDate, endDate } = formatLastThreeMonths();
      getTransactionsByItemId(id, startDate, endDate);

      // fetch new accounts data. AKA balance updates
      getAccountsByItemId(id);

      // leave a notification that we have new transaction data to be fetched
      notifications.show({
        title: `Updates available for ${institutions.byItemId[id].name}`,
        message: "New balance and transaction data have been received!",
      });
    });

    socket.on("NEW_TRANSACTIONS_DATA", ({ itemId }) => {
      // fetch new transactions data. Only fetching last 3 months.
      const { startDate, endDate } = formatLastThreeMonths();
      getTransactionsByItemId(itemId, startDate, endDate);

      // fetch new accounts data. AKA balance updates
      getAccountsByItemId(itemId);
    });

    // ITEMS WEBHOOKS
    socket.on("PENDING_EXPIRATION", ({ id }) => {
      const institutionName = institutions.byItemId[id].name;
      notifications.show({
        title: `${institutionName} Pending Expiration`,
        message:
          "Access consent is expiring soon. Please re-enter credentials to continue receiving your financial updates.",
      });
      console.log(
        "Access consent is expiring soon. Please re-enter credentials to continue receiving your financial updates.",
        id
      );
      // item will now be in 'bad' state
      getItemById(id);
    });

    socket.on("ERROR", ({ id, error }) => {
      const institutionName = institutions.byItemId[id].name;
      console.log(error);
      notifications.show({
        title: `Login Error`,
        message: `${institutionName}: Item Login Required`,
      });
      console.log(`${institutionName}: Item Login Required`);
      // item will now be in 'bad' state
      getItemById(id);
    });

    // close the connection to avoid memory leaks
    return () => {
      socket.disconnect();
    };
  }, [
    getAccountsByItemId,
    getInstitutionById,
    getTransactionsByItemId,
    institutions.byItemId,
    generateItemLinkToken,
    getItemById,
    user,
  ]);
  return <></>;
};

export default Sockets;
