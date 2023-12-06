import React, { useEffect } from "react";
import { io } from "socket.io-client";
import useTransactionsContext from "../contexts/TransactionsContext";
import useAccountsContext from "../contexts/AccountsContext";

const Sockets = () => {
  const { getTransactionsByItemId } = useTransactionsContext();
  const { getAccountsByItemId } = useAccountsContext();
  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("NEW_TRANSACTIONS_DATA", ({ itemId }) => {
      // leave a notification that we have new transaction data to be fetched

      // fetch new transactions data
      getTransactionsByItemId(itemId);

      // fetch new accounts data. AKA balance updates
      getAccountsByItemId(itemId);
    });

    // close the connection to avoid memory leaks
    return () => {
      socket.disconnect();
    };
  }, []);
  return <div>Sockets</div>;
};

export default Sockets;
