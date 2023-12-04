import React from "react";
import { useEffect, useState } from "react";
import useInstitutionsContext from "../contexts/InstitutionsContext";
import useItemsContext from "../contexts/ItemsContext";
import useUserContext from "../contexts/UserContext";
import useAccountsContext, { Account } from "../contexts/AccountsContext";

const Dashboard = () => {
  const { itemsArray, getItemsByUser } = useItemsContext();
  const { user } = useUserContext();
  const { groupAccountsByItemId, getAccountsByUser } = useAccountsContext();
  const { institutions } = useInstitutionsContext();
  const [accounts, setAccounts] = useState<{ [itemId: string]: Account[] }>();
  // get items
  useEffect(() => {
    if (user) {
      getItemsByUser(user.id);
    }
  }, [user]);

  // get accounts and group them according to their respective items
  useEffect(() => {
    async function fetch() {
      if (user) {
        await getAccountsByUser(user.id);
        setAccounts(groupAccountsByItemId);
      }
    }
    fetch();
  }, [user]);

  console.log(accounts);

  return <div>Dashboard</div>;
};

export default Dashboard;
