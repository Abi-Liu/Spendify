import React, { useEffect } from "react";
import { io } from "socket.io-client";

const Sockets = () => {
  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("New Transactions Data", ({ itemId }) => {
      console.log(itemId);
    });
  }, []);
  return <div>Sockets</div>;
};

export default Sockets;
