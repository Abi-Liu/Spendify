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
  Tooltip,
  Group,
} from "@mantine/core";
import AccountDetails from "./AccountDetails";
import useTransactionsContext from "../contexts/TransactionsContext";
import { TbDots, TbTrash, TbAlertTriangle } from "react-icons/tb";
import api from "../utils/axios";
import useLinkContext from "../contexts/LinkTokenContext";
import useUserContext from "../contexts/UserContext";
import PlaidLink from "./PlaidLink";

//  CHANGE IN DEVELOPMENT
const PLAID_ENV = "sandbox";

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

  const { user } = useUserContext();
  const { deleteItemById } = useItemsContext();
  const { deleteTransactionsByItemId } = useTransactionsContext();
  const {
    getAccountsByItemId,
    deleteAccountsByItemId,
    groupAccountsByItemId,
    accounts: accountsState,
  } = useAccountsContext();

  console.log(accountsState);

  const { getInstitutionById, institutions, formatLogo } =
    useInstitutionsContext();

  const { generateItemLinkToken, linkTokens } = useLinkContext();

  const { id, plaid_institution_id, updated_at } = item;

  useEffect(() => {
    getAccountsByItemId(item.id);
  }, [getAccountsByItemId, item]);

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

  async function resetItemLogin() {
    await api.post("/plaid/test-reset-item/", { id });
  }

  async function initiateLink() {
    // geerate new link token only when user clicks the button
    if (user) {
      await generateItemLinkToken(user.id, id);
    }
  }

  return (
    <Accordion.Item key={item.id} value={item.plaid_institution_id}>
      {linkTokens.byItem[id] != null && linkTokens.byItem[id].length > 0 && (
        <PlaidLink
          userId={user!.id}
          linkToken={linkTokens.byItem[id]}
          itemId={id}
        />
      )}
      <Center>
        {item.status === "bad" && (
          <Tooltip label="Update Needed. Click to update login.">
            <ActionIcon variant="transparent" c={"red"} onClick={initiateLink}>
              <TbAlertTriangle />
            </ActionIcon>
          </Tooltip>
        )}
        <Accordion.Control
          icon={
            <Avatar
              src={formatLogo(institution?.logo)}
              alt={`${institution?.name} logo`}
            />
          }
        >
          <Group gap={0}>
            <Text>{institution?.name}</Text>
          </Group>
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
            {PLAID_ENV === "sandbox" && (
              <Menu.Item onClick={resetItemLogin}>reset login</Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Center>

      {accounts &&
        accounts.map((account) => (
          <AccountDetails key={account.id} account={account} />
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
