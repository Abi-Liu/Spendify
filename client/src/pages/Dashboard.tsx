import React from "react";
import { useEffect, useState } from "react";
import useItemsContext from "../contexts/ItemsContext";
import useUserContext from "../contexts/UserContext";
import useAccountsContext, { Account } from "../contexts/AccountsContext";
import useTransactionsContext from "../contexts/TransactionsContext";

const Dashboard = () => {
  const [accounts, setAccounts] = useState<{ [itemId: string]: Account[] }>();
  const { itemsArray, getItemsByUser } = useItemsContext();
  const { user } = useUserContext();
  const { groupAccountsByItemId, getAccountsByUser } = useAccountsContext();
  const { groupTransactions } = useTransactionsContext();
  // get items
  useEffect(() => {
    async function fetch() {
      if (user) {
        console.log("fire items get");
        await getItemsByUser(user.id);
      }
    }
    fetch();
  }, [user]);

  // get accounts and group them according to their respective items
  useEffect(() => {
    async function fetch() {
      if (user && Object.keys(itemsArray).length !== 0) {
        console.log("fire accounts get");
        await getAccountsByUser(user.id);
        setAccounts(groupAccountsByItemId());
      }
    }
    fetch();
  }, [user]);

  console.log(accounts);

  // get transactions so we can break down the summary of spending.

  return <div>Dashboard</div>;
};

export default Dashboard;
