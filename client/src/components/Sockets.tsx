import React, { useEffect } from "react";
import { io } from "socket.io-client";
import useTransactionsContext from "../contexts/TransactionsContext";
import useAccountsContext from "../contexts/AccountsContext";
import formatLastThreeMonths from "../utils/formatDates";
import { notifications } from "@mantine/notifications";
import useInstitutionsContext from "../contexts/InstitutionsContext";

const Sockets = () => {
  const { getTransactionsByItemId } = useTransactionsContext();
  const { getAccountsByItemId } = useAccountsContext();
  const { institutions } = useInstitutionsContext();
  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("NEW_TRANSACTIONS_DATA", ({ itemId }) => {
      console.log("NEW TRANSACTIONS FOR ITEM: ", itemId);

      console.log(institutions);

      // fetch new transactions data. Only fetching last 3 months.
      const { startDate, endDate } = formatLastThreeMonths();
      getTransactionsByItemId(itemId, startDate, endDate);

      // fetch new accounts data. AKA balance updates
      getAccountsByItemId(itemId);

      // leave a notification that we have new transaction data to be fetched
      notifications.show({
        title: `Updates available`,
        message: "New balance and transaction data have been received!",
      });
    });

    // close the connection to avoid memory leaks
    return () => {
      socket.disconnect();
    };
  }, [getAccountsByItemId, getTransactionsByItemId, institutions]);
  return <></>;
};

export default Sockets;
