import React, { useEffect, useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Button,
  Flex,
  useMantineColorScheme,
  useComputedColorScheme,
  ScrollArea,
  Divider,
  ActionIcon,
  Stack,
  Text,
  Title,
  Group,
  Image,
  Menu,
} from "@mantine/core";
import { TbSunHigh, TbMoon, TbPlus, TbChevronDown } from "react-icons/tb";
import useItemsContext from "../contexts/ItemsContext";
import ItemAccordion from "./ItemAccordion";
import useLinkContext from "../contexts/LinkTokenContext";
import useUserContext from "../contexts/UserContext";
import PlaidLink from "./PlaidLink";
import Loading from "./Loading";
import useAccountsContext from "../contexts/AccountsContext";
import calculateNetworth from "../utils/calculateNetworth";
import formatCurrency from "../utils/formatDollar";
import { Outlet, useNavigate } from "react-router-dom";
import FullLogo from "../assets/FullLogo.png";
import UserMenu from "./UserMenu";
import useAssetsContext from "../contexts/AssetsContext";

export default function Appshell({
  children,
  showNav,
}: {
  children?: React.ReactNode;
  showNav: boolean;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [link, setLink] = useState("");
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark");
  const { itemsArray, loading: itemsLoading } = useItemsContext();
  const { accounts } = useAccountsContext();
  const { generateUserLinkToken, linkTokens } = useLinkContext();
  const { user } = useUserContext();
  const { assets } = useAssetsContext();

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "light" ? "dark" : "light");
  };

  const navigate = useNavigate();

  const navigationLinks = showNav
    ? [
        { name: "Dashboard", link: "/dashboard" },
        { name: "Transactions", link: `transactions` },
        { name: "Networth", link: "networth" },
        { name: "Budgeting", link: "budget" },
      ]
    : [];

  const navbarProps = showNav
    ? {
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }
    : undefined;

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
    <AppShell header={{ height: 70 }} navbar={navbarProps} padding="md">
      <AppShell.Header>
        <Flex
          justify="space-between"
          align="center"
          style={{ padding: ".625rem 1.25rem" }}
        >
          <Group>
            {showNav && (
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
            )}
            <Image src={FullLogo} fit="contain" h={52} w={140} />
          </Group>
          <Group>
            {navigationLinks.map((link) => (
              <Button
                key={link.name}
                variant="transparent"
                style={{
                  color: computedColorScheme === "light" ? "black" : "#CED4DA",
                  fontWeight: "normal",
                }}
                onClick={() => navigate(link.link)}
                visibleFrom="sm"
              >
                {link.name}
              </Button>
            ))}
            <Menu shadow="md">
              <Menu.Target>
                <ActionIcon
                  color={computedColorScheme === "light" ? "black" : "gray"}
                  variant="subtle"
                  hiddenFrom="sm"
                >
                  <TbChevronDown />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {navigationLinks.map((link) => (
                  <Menu.Item
                    key={link.name}
                    onClick={() => navigate(link.link)}
                  >
                    {link.name}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            <Button onClick={toggleColorScheme} size="sm" variant="transparent">
              {computedColorScheme === "light" ? (
                <TbMoon size={24} />
              ) : (
                <TbSunHigh size={24} />
              )}
            </Button>
          </Group>
        </Flex>
      </AppShell.Header>

      {showNav && user && (
        <AppShell.Navbar p="md">
          {itemsLoading ? (
            <Loading />
          ) : (
            <>
              <AppShell.Section style={{ paddingBottom: "1rem" }}>
                <Stack align="stretch" gap="xs">
                  <Flex justify="flex-end">
                    <ActionIcon
                      variant="transparent"
                      aria-label="link bank"
                      onClick={initiateLink}
                    >
                      <TbPlus />
                    </ActionIcon>
                    {link && <PlaidLink userId={user.id} linkToken={link} />}
                  </Flex>
                  {Object.keys(accounts).length > 0 && (
                    <>
                      <Stack
                        align="flex-start"
                        style={{ paddingBottom: "1rem" }}
                      >
                        <Title order={4}>Net Worth</Title>
                        <Text size="2rem">
                          {formatCurrency(
                            depository +
                              investment -
                              credit -
                              loan +
                              assetsTotal
                          )}
                        </Text>
                      </Stack>
                      <Flex justify="space-between">
                        <Text size="sm">Assets</Text>
                        <Text size="sm">
                          {formatCurrency(
                            depository + investment + assetsTotal
                          )}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text size="sm">Liabilities</Text>
                        <Text size="sm">{formatCurrency(credit + loan)}</Text>
                      </Flex>
                    </>
                  )}
                </Stack>
              </AppShell.Section>
              <Divider />
              <AppShell.Section grow component={ScrollArea}>
                {itemsArray.length > 0 ? (
                  <ItemAccordion items={itemsArray} />
                ) : (
                  <div>
                    <p>No Items linked yet! Add a bank to get started.</p>
                  </div>
                )}
              </AppShell.Section>
              <Divider style={{ paddingBottom: "1rem" }} />
              <AppShell.Section>
                <Flex justify="space-between" align="center">
                  <Button onClick={initiateLink}>Link Bank!</Button>
                  <UserMenu />
                </Flex>
              </AppShell.Section>
            </>
          )}
        </AppShell.Navbar>
      )}

      <AppShell.Main>{children ? children : <Outlet />}</AppShell.Main>
    </AppShell>
  );
}
