import React from "react";
import { useEffect, useState } from "react";
import useItemsContext from "../contexts/ItemsContext";
import useUserContext from "../contexts/UserContext";
import useAccountsContext, { Account } from "../contexts/AccountsContext";
import useTransactionsContext from "../contexts/TransactionsContext";
import { TransactionsGroup } from "../contexts/TransactionsContext";
import formatLastThreeMonths from "../utils/formatDates";
import Appshell from "../components/Appshell";
import api from "../utils/axios";
import PlaidLink from "../components/PlaidLink";

const Dashboard = () => {
  const [groupedAccounts, setGroupedAccounts] = useState<{
    [itemId: string]: Account[];
  }>({});
  const [transactions, setTransactions] = useState<TransactionsGroup>();
  const { itemsArray, getItemsByUser } = useItemsContext();
  const { user } = useUserContext();
  const { groupAccountsByItemId, getAccountsByUser, accounts } =
    useAccountsContext();
  const {
    getTransactionsByUserId,
    groupTransactions,
    transactions: transactionsContextState,
  } = useTransactionsContext();

  // get all items for the user
  useEffect(() => {
    async function fetch() {
      if (user) {
        await getItemsByUser(user.id);
      }
    }
    fetch();
  }, [user, getItemsByUser]);

  // get all accounts associated with the user
  useEffect(() => {
    getAccountsByUser(user!.id);
  }, [user, getAccountsByUser]);

  // set accounts state to the grouped accounts by item id
  useEffect(() => {
    if (Object.keys(accounts).length !== 0) {
      setGroupedAccounts(groupAccountsByItemId());
    }
  }, [accounts, groupAccountsByItemId]);

  // get transactions so we can break down the summary of spending. Only fetch first 3 months of transactions.
  // this will be used for budgeting and spending analysis. also comparing spending to previous month.
  useEffect(() => {
    // returns first day of 2 months ago and last day of the current month
    const { startDate, endDate } = formatLastThreeMonths();

    getTransactionsByUserId(user!.id, startDate, endDate);
  }, [getTransactionsByUserId, user]);

  // set transactions state broken down by account, item, and user
  useEffect(() => {
    if (transactionsContextState) {
      setTransactions(groupTransactions());
    }
  }, [transactionsContextState, groupTransactions]);

  return (
    <Appshell showNav={true}>
      <div>
        {itemsArray.length > 0 ? (
          itemsArray.map((item) => {
            return (
              <>
                <p>{item.id}</p>
                <p>
                  {Object.keys(groupedAccounts).length > 0 &&
                    groupedAccounts[item.id] &&
                    groupedAccounts[item.id][0].current_balance}
                </p>
              </>
            );
          })
        ) : (
          <>
            <h1>No Banks Linked!</h1>
            <h3>Link a bank to get started</h3>
          </>
        )}
      </div>
    </Appshell>
  );
};

export default Dashboard;
