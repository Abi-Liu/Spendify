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

  const [accounts, setAccounts] = useState<{ [itemId: string]: Account[] }>({});
  const [transactions, setTransactions] = useState<TransactionsGroup>();
  const { itemsArray, getItemsByUser } = useItemsContext();
  const { user } = useUserContext();
  const { groupAccountsByItemId, getAccountsByUser } = useAccountsContext();
  const { getTransactionsByUserId, groupTransactions } =
    useTransactionsContext();

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
  }, [user, itemsArray]);
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

  return (
    <Appshell showNav={true}>
      <div>
        {itemsArray.length > 0 ? (
          itemsArray.map((item) => {
            return (
              <>
                <p>{item.id}</p>
                <p>
                  {Object.keys(accounts).length > 0 &&
                    accounts[item.id][0].current_balance}
                </p>
              </>
            );
          })
        ) : (
          <>
            <h1>No Banks Linked!</h1>
            <h3>Link a bank to get started</h3>
            <PlaidLink linkToken={linkToken} userId={user!.id} />
          </>
        )}
      </div>
    </Appshell>
  );
};

export default Dashboard;
