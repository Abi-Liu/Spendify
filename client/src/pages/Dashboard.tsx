import React from "react";
import { useEffect, useState } from "react";
import useItemsContext from "../contexts/ItemsContext";
import useUserContext from "../contexts/UserContext";
import useAccountsContext, { Account } from "../contexts/AccountsContext";
import useTransactionsContext from "../contexts/TransactionsContext";
import { TransactionsGroup } from "../contexts/TransactionsContext";
import formatLastThreeMonths from "../utils/formatDates";

const Dashboard = () => {
  const [accounts, setAccounts] = useState<{ [itemId: string]: Account[] }>();
  const [transactions, setTransactions] = useState<TransactionsGroup>();
  const { itemsArray, getItemsByUser } = useItemsContext();
  const { user } = useUserContext();
  const { groupAccountsByItemId, getAccountsByUser } = useAccountsContext();
  const { getTransactionsByUserId, groupTransactions } =
    useTransactionsContext();
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
  console.log(itemsArray);
  console.log(accounts);

  // get transactions so we can break down the summary of spending. Only fetch first 3 months of transactions.
  // this will be used for budgeting and spending analysis. also comparing spending to previous month.
  useEffect(() => {
    async function fetch() {
      if (user) {
        // returns first day of 2 months ago and last day of the current month
        const { startDate, endDate } = formatLastThreeMonths();

        await getTransactionsByUserId(user?.id, startDate, endDate);
        setTransactions(groupTransactions());
      }
    }
    fetch();
  }, [user]);
  console.log(transactions);
  return <div></div>;
};

export default Dashboard;
