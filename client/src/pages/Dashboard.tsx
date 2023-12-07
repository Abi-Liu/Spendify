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
  const [linkToken, setLinkToken] = useState(null);

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

  // set link token.
  // TODO: Create context for link tokens state
  useEffect(() => {
    let ignore = false;
    async function createLinkToken() {
      try {
        const response = await api.post("/plaid/createLinkToken", {
          id: `${user?.id}`,
        });
        console.log(response);
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.log(error);
      }
    }
    if (user && !ignore) {
      createLinkToken();
    }

    return () => {
      ignore = true;
    };
  }, [user]);

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

  // get groupedAccounts and group them according to their respective items
  useEffect(() => {
    getAccountsByUser(user!.id);
  }, [user]);

  useEffect(() => {
    console.log("ACCOUNTS FETCHED", accounts);
  }, [accounts]);

  useEffect(() => {
    if (Object.keys(accounts).length !== 0) {
      setGroupedAccounts(groupAccountsByItemId());
    }
  }, [accounts]);
  console.log(itemsArray);
  console.log(groupedAccounts);

  // get transactions so we can break down the summary of spending. Only fetch first 3 months of transactions.
  // this will be used for budgeting and spending analysis. also comparing spending to previous month.
  useEffect(() => {
    // returns first day of 2 months ago and last day of the current month
    const { startDate, endDate } = formatLastThreeMonths();

    getTransactionsByUserId(user!.id, startDate, endDate);
  }, []);

  useEffect(() => {
    if (transactionsContextState) {
      setTransactions(groupTransactions());
    }
  }, [transactionsContextState]);
  console.log(transactions);

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
                    groupedAccounts[item.id][0].current_balance}
                </p>
              </>
            );
          })
        ) : (
          <>
            <h1>No Banks Linked!</h1>
            <h3>Link a bank to get started</h3>
            <PlaidLink linkToken={linkToken} />
          </>
        )}
      </div>
    </Appshell>
  );
};

export default Dashboard;
