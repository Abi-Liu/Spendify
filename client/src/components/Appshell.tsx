import React, { useEffect, useState } from "react";
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
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { TbSunHigh, TbMoon, TbLogout } from "react-icons/tb";
import useItemsContext from "../contexts/ItemsContext";
import ItemAccordion from "./ItemAccordion";
import useLinkContext from "../contexts/LinkTokenContext";
import useUserContext from "../contexts/UserContext";
import PlaidLink from "./PlaidLink";
import Loading from "./Loading";
// import PlaidLink from "./PlaidLink";

export default function Appshell({
  children,
  showNav,
}: {
  children: React.ReactNode;
  showNav: boolean;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [link, setLink] = useState("");
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark");
  const { itemsArray, loading: itemsLoading } = useItemsContext();
  const { generateUserLinkToken, linkTokens } = useLinkContext();
  const { user } = useUserContext();

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "light" ? "dark" : "light");
  };

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

  return (
    <AppShell header={{ height: 60 }} navbar={navbarProps} padding="md">
      <AppShell.Header>
        <Flex
          justify="space-between"
          align="center"
          style={{ padding: ".625rem 1.25rem" }}
        >
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div>Logo</div>
          <Button onClick={toggleColorScheme} size="sm" variant="transparent">
            {computedColorScheme === "light" ? (
              <TbMoon size={24} />
            ) : (
              <TbSunHigh size={24} />
            )}
          </Button>
        </Flex>
      </AppShell.Header>

      {showNav && user && (
        <AppShell.Navbar p="md">
          {itemsLoading ? (
            <Loading />
          ) : (
            <>
              <AppShell.Section style={{ paddingBottom: "1rem" }}>
                <Flex justify="flex-end">
                  <Button onClick={initiateLink}>Link Bank!</Button>
                  {link && <PlaidLink userId={user.id} linkToken={link} />}
                </Flex>
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
              <Divider />
              <AppShell.Section style={{ paddingTop: "1rem" }}>
                <Flex justify="flex-end">
                  <Tooltip label="Logout">
                    <ActionIcon variant="light" aria-label="Logout">
                      <TbLogout size={24} />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              </AppShell.Section>
            </>
          )}
        </AppShell.Navbar>
      )}

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
