import React, { useState } from "react";
import Appshell from "../components/Appshell";
import TransactionsTable from "../components/TransactionsTable";

const TransactionsPage = () => {
  return (
    <Appshell showNav={true}>
      <TransactionsTable />
    </Appshell>
  );
};

export default TransactionsPage;
