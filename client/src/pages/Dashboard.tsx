import React from "react";
import { useEffect, useState } from "react";
import useItemsContext from "../contexts/ItemsContext";
import useUserContext from "../contexts/UserContext";
import useAccountsContext, { Account } from "../contexts/AccountsContext";
import useTransactionsContext from "../contexts/TransactionsContext";
import { TransactionsGroup } from "../contexts/TransactionsContext";

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
        // format dates - get the last day of the current month and the first day of the previous previous month
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const lastDayOfCurrentMonth = new Date(year, month, 0);
        const twoMonthsAgo = month - 2;
        // Handle the case where the current month is January or February
        // Adjust the year and month accordingly
        const adjustedYear = twoMonthsAgo < 0 ? year - 1 : year;
        const adjustedMonth =
          twoMonthsAgo < 0 ? 12 + twoMonthsAgo : twoMonthsAgo; // Adjust the month value for previous months
        const firstDayOfPreviousPreviousMonth = new Date(
          adjustedYear,
          adjustedMonth,
          1
        );

        const formattedStart = firstDayOfPreviousPreviousMonth
          .toISOString()
          .split("T")[0];
        const formattedEnd = lastDayOfCurrentMonth.toISOString().split("T")[0];

        await getTransactionsByUserId(user?.id, formattedStart, formattedEnd);
        setTransactions(groupTransactions());
      }
    }
    fetch();
  }, [user]);
  console.log(transactions);
  return <div></div>;
};

export default Dashboard;
