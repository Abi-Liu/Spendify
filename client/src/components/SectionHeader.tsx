import { Stack, Flex, ActionIcon, Title, Text } from "@mantine/core";

import { TbPlus } from "react-icons/tb";
import PlaidLink from "./PlaidLink";
import formatCurrency from "../utils/formatDollar";
import useLinkContext from "../contexts/LinkTokenContext";
import useUserContext from "../contexts/UserContext";
import useAccountsContext from "../contexts/AccountsContext";
import { useEffect, useMemo, useState } from "react";
import useAssetsContext from "../contexts/AssetsContext";
import calculateNetworth from "../utils/calculateNetworth";

const SectionHeader = () => {
  const [link, setLink] = useState("");

  const { generateUserLinkToken, linkTokens } = useLinkContext();
  const { user } = useUserContext();
  const { accounts } = useAccountsContext();
  const { assets } = useAssetsContext();

  async function initiateLink() {
    // geerate new link token only when user clicks the button
    if (user) {
      await generateUserLinkToken(user.id);
    }
  }

  useEffect(() => {
    if (user) {
      setLink(linkTokens.byUser[user.id]);
    }
  }, [linkTokens, user]);

  // calculate networth
  const { depository, credit, loan, investment, assetsTotal } = useMemo(() => {
    const calculateNetWorthAccounts = Object.values(accounts);
    // include assets
    const totalAssets = Object.values(assets);

    return calculateNetworth(calculateNetWorthAccounts, totalAssets);
  }, [accounts, assets]);

  return (
    <Stack align="stretch" gap="xs">
      {link && <PlaidLink userId={user!.id} linkToken={link} />}
      <Flex justify="flex-end">
        <ActionIcon
          variant="subtle"
          aria-label="link bank"
          onClick={initiateLink}
        >
          <TbPlus size={22} />
        </ActionIcon>
      </Flex>
      {Object.keys(accounts).length > 0 && (
        <>
          <Stack align="flex-start" style={{ paddingBottom: "1rem" }}>
            <Title order={4}>Net Worth</Title>
            <Text size="2rem">
              {formatCurrency(
                depository + investment - credit - loan + assetsTotal
              )}
            </Text>
          </Stack>
          <Flex justify="space-between">
            <Text size="sm">Assets</Text>
            <Text size="sm">
              {formatCurrency(depository + investment + assetsTotal)}
            </Text>
          </Flex>
          <Flex justify="space-between">
            <Text size="sm">Liabilities</Text>
            <Text size="sm">{formatCurrency(credit + loan)}</Text>
          </Flex>
        </>
      )}
    </Stack>
  );
};

export default SectionHeader;
