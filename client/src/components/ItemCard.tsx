import { useEffect, useState } from "react";
import useAccountsContext, { Account } from "../contexts/AccountsContext";
import { Item } from "../contexts/ItemsContext";
import { Institution } from "plaid";
import useInstitutionsContext from "../contexts/InstitutionsContext";
import { Accordion } from "@mantine/core";
import AccountDetails from "./AccountDetails";

const ItemCard = ({ item }: { item: Item }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [institution, setInstitution] = useState<Institution>();

  const { deleteAccountsByItemId, groupAccountsByItemId } =
    useAccountsContext();

  const { getInstitutionById, institutions } = useInstitutionsContext();

  const { id, plaid_institution_id } = item;

  useEffect(() => {
    const accounts = groupAccountsByItemId();
    setAccounts(accounts[id]);
  }, [id]);

  useEffect(() => {
    getInstitutionById(plaid_institution_id);
  }, []);

  useEffect(() => {
    setInstitution(institutions[plaid_institution_id]);
  }, [institutions, plaid_institution_id]);

  console.log(accounts);
  console.log(institution);

  return (
    <Accordion.Item value={item.plaid_institution_id}>
      <Accordion.Control icon={institution?.logo}>
        {institution?.name}
      </Accordion.Control>
      {accounts &&
        accounts.map((account) => (
          <AccountDetails key={account.id} account={account} />
        ))}
    </Accordion.Item>
  );
};

export default ItemCard;
