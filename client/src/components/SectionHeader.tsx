import {
  Stack,
  Flex,
  ActionIcon,
  Title,
  Text,
  Accordion,
  Group,
  Menu,
} from "@mantine/core";

import {
  TbPlus,
  TbPigMoney,
  TbDots,
  TbTrash,
  TbPencilCog,
} from "react-icons/tb";
import { GiPayMoney } from "react-icons/gi";
import PlaidLink from "./PlaidLink";
import formatCurrency from "../utils/formatDollar";
import useLinkContext from "../contexts/LinkTokenContext";
import useUserContext from "../contexts/UserContext";
import useAccountsContext from "../contexts/AccountsContext";
import useNetworthContext from "../contexts/NetworthContext";
import { useEffect, useMemo, useState } from "react";
import useAssetsContext from "../contexts/AssetsContext";
import calculateNetworth from "../utils/calculateNetworth";
import formatTextCapitalization from "../utils/formatText";

interface NetWorthProps {
  depository: number;
  credit: number;
  loan: number;
  investment: number;
  assetsTotal: number;
}

const NetWorthAccordion = ({
  depository,
  credit,
  loan,
  investment,
  assetsTotal,
}: NetWorthProps) => {
  const [value, setValue] = useState<string[]>([]);
  const { assets, deleteAsset } = useAssetsContext();

  // TODO: FINISH IMPLEMENTING ASSET EDITING

  return (
    <Accordion
      chevronPosition="right"
      variant="filled"
      multiple
      value={value}
      onChange={setValue}
    >
      <Accordion.Item value="assets" px={0} mx={0}>
        <Accordion.Control icon={<TbPigMoney size={20} />}>
          <Group wrap="nowrap">
            <div>
              <Text>Assets</Text>
              <Text size="sm" c="dimmed" fw={600}>
                {formatCurrency(depository + investment + assetsTotal)}
              </Text>
            </div>
          </Group>
        </Accordion.Control>

        <Accordion.Panel>
          <Stack gap={10}>
            <Group justify="space-between">
              <Text size="sm" c="dimmed" fw={500}>
                Cash
              </Text>
              <Text size="sm" c="dimmed" fw={500}>
                {formatCurrency(depository)}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed" fw={500}>
                Investments
              </Text>
              <Text size="sm" c="dimmed" fw={500}>
                {formatCurrency(investment)}
              </Text>
            </Group>
            {Object.values(assets).map((asset) => (
              <Group justify="space-between">
                <Text size="sm" c="dimmed" fw={500}>
                  {formatTextCapitalization(asset.name)}
                </Text>
                <Group gap={0}>
                  <Text size="sm" c="dimmed" fw={500}>
                    {formatCurrency(Number(asset.value))}
                  </Text>
                  <Menu>
                    <Menu.Target>
                      <ActionIcon size="md" variant="subtle" color="gray">
                        <TbDots size={16} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item rightSection={<TbPencilCog />} c="dimmed">
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => deleteAsset(asset.id)}
                        rightSection={<TbTrash />}
                        c="dimmed"
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Group>
            ))}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="liabilities">
        <Accordion.Control icon={<GiPayMoney size={20} />}>
          <Group wrap="nowrap">
            <div>
              <Text>Liabilities</Text>
              <Text size="sm" c="dimmed" fw={600}>
                {formatCurrency(credit + loan)}
              </Text>
            </div>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap={10}>
            <Group justify="space-between">
              <Text size="sm" c="dimmed" fw={500}>
                Credit
              </Text>
              <Text size="sm" c="dimmed" fw={500}>
                {formatCurrency(credit)}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed" fw={500}>
                Loans
              </Text>
              <Text size="sm" c="dimmed" fw={500}>
                {formatCurrency(loan)}
              </Text>
            </Group>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

const SectionHeader = () => {
  const [link, setLink] = useState("");

  const { generateUserLinkToken, linkTokens } = useLinkContext();
  const { user } = useUserContext();
  const { accounts } = useAccountsContext();
  const { assets } = useAssetsContext();
  const { updateNetworth } = useNetworthContext();

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

  useEffect(() => {
    const networth = depository + investment + assetsTotal - loan - credit;
    updateNetworth(user!.id, networth);
  }, [depository, credit, loan, investment, assetsTotal, user, updateNetworth]);

  return (
    <Stack gap="xs">
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
          <Stack>
            <Title order={4}>Net Worth</Title>
            <Text size="2rem">
              {formatCurrency(
                depository + investment - credit - loan + assetsTotal
              )}
            </Text>
          </Stack>
          <NetWorthAccordion
            credit={credit}
            depository={depository}
            investment={investment}
            loan={loan}
            assetsTotal={assetsTotal}
          />
        </>
      )}
    </Stack>
  );
};

export default SectionHeader;
