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
  const { institutions, getInstitutionById } = useInstitutionsContext();
  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("SYNC_UPDATES_AVAILABLE", ({ id }) => {
      console.log("NEW TRANSACTIONS FOR ITEM: ", id);

      // fetch new transactions data. Only fetching last 3 months.
      const { startDate, endDate } = formatLastThreeMonths();
      getTransactionsByItemId(id, startDate, endDate);

      // fetch new accounts data. AKA balance updates
      getAccountsByItemId(id);

      // leave a notification that we have new transaction data to be fetched
      notifications.show({
        title: `Updates available for ${institutions.byItemId[id].institution_id}`,
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

    // close the connection to avoid memory leaks
    return () => {
      socket.disconnect();
    };
  }, [
    getAccountsByItemId,
    getInstitutionById,
    getTransactionsByItemId,
    institutions.byItemId,
  ]);
  return <></>;
};

export default Sockets;
