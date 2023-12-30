import { useEffect, useState } from "react";
import useAccountsContext, { Account } from "../contexts/AccountsContext";
import useItemsContext, { Item } from "../contexts/ItemsContext";
import { Institution } from "plaid";
import useInstitutionsContext from "../contexts/InstitutionsContext";
import {
  Accordion,
  Text,
  ActionIcon,
  Center,
  Menu,
  Avatar,
} from "@mantine/core";
import AccountDetails from "./AccountDetails";
import useTransactionsContext from "../contexts/TransactionsContext";
import { TbDots, TbTrash } from "react-icons/tb";

const calculateUpdatedTime = (updatedAt: string): string => {
  const date = new Date(updatedAt);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));

  let updatedTime = "";
  if (hours === 0) {
    updatedTime = `Updated < 1 hour ago`;
  } else if (hours === 1) {
    updatedTime = `Updated 1 hour ago`;
  } else if (hours > 1 && hours < 24) {
    updatedTime = `Updated ${hours} hours ago`;
  } else {
    const plural = Math.floor(hours / 24) > 1 ? "days" : "day";
    updatedTime = `Updated ${Math.floor(hours / 24)} ${plural} ago`;
  }

  return updatedTime;
};

const ItemCard = ({ item }: { item: Item }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [institution, setInstitution] = useState<Institution>();

  const { deleteItemById } = useItemsContext();
  const { deleteTransactionsByItemId } = useTransactionsContext();
  const { deleteAccountsByItemId, groupAccountsByItemId } =
    useAccountsContext();

  const { getInstitutionById, institutions, formatLogo } =
    useInstitutionsContext();

  const { id, plaid_institution_id, updated_at } = item;

  useEffect(() => {
    const accounts = groupAccountsByItemId();
    setAccounts(accounts[id]);
  }, [id, groupAccountsByItemId]);

  useEffect(() => {
    getInstitutionById(plaid_institution_id, item.id);
  }, [getInstitutionById, plaid_institution_id, item.id]);

  useEffect(() => {
    setInstitution(institutions.byInstitutionId[plaid_institution_id]);
  }, [institutions, plaid_institution_id]);

  const updatedTime = calculateUpdatedTime(updated_at);

  function handleDelete(itemId: number) {
    deleteItemById(itemId);
    deleteAccountsByItemId(itemId);
    deleteTransactionsByItemId(itemId);
  }

  return (
    <Accordion.Item key={item.id} value={item.plaid_institution_id}>
      <Center>
        <Accordion.Control
          icon={
            <Avatar
              src={formatLogo(institution?.logo)}
              alt={`${institution?.name} logo`}
            />
          }
        >
          {institution?.name}
        </Accordion.Control>
        <Menu>
          <Menu.Target>
            <ActionIcon size="md" variant="subtle" color="gray">
              <TbDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<TbTrash />}
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Center>

      {accounts &&
        accounts.map((account) => (
          <>
            <AccountDetails key={account.id} account={account} />
          </>
        ))}
      <Accordion.Panel>
        <Text ta="right" size="xs">
          {updatedTime}
        </Text>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default ItemCard;
