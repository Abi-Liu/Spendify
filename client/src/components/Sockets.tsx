import React, { useEffect } from "react";
import { io } from "socket.io-client";
import useTransactionsContext from "../contexts/TransactionsContext";

const Sockets = () => {
  const { getTransactionsByItemId } = useTransactionsContext();
  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("NEW_TRANSACTIONS_DATA", ({ itemId }) => {
      // leave a notification that we have new transaction data to be fetched

      // fetch new transactions data
      getTransactionsByItemId(itemId);
    });

    // close the connection to avoid memory leaks
    return () => {
      socket.disconnect();
    };
  }, []);
  return <div>Sockets</div>;
};

export default Sockets;
