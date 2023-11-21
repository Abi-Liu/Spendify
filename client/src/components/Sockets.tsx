import React, { useEffect } from "react";
import { io } from "socket.io-client";

const Sockets = () => {
  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("New Transactions Data", ({ itemId }) => {
      console.log(itemId);
    });

    // close the connection to avoid memory leaks
    return () => {
      socket.disconnect();
    };
  }, []);
  return <div>Sockets</div>;
};

export default Sockets;
