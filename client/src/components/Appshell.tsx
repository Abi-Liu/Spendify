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
} from "@mantine/core";
import { TbSunHigh, TbMoon } from "react-icons/tb";
import useItemsContext from "../contexts/ItemsContext";
import ItemAccordion from "./ItemAccordion";
import useLinkContext from "../contexts/LinkTokenContext";
import useUserContext, { UserState } from "../contexts/UserContext";
import PlaidLink from "./PlaidLink";
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
  const [userState, setUserState] = useState<UserState | null>(null);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark");
  const { itemsArray } = useItemsContext();
  const { generateUserLinkToken, linkTokens } = useLinkContext();
  const { user } = useUserContext();

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    setUserState(user);
  }, [user]);

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
          <AppShell.Section>
            <Flex justify="flex-end">
              <Button onClick={initiateLink}>Link Bank!</Button>
              {link && <PlaidLink userId={user.id} linkToken={link} />}
            </Flex>
          </AppShell.Section>
          <AppShell.Section component={ScrollArea}>
            {itemsArray.length > 0 ? (
              <ItemAccordion items={itemsArray} />
            ) : (
              <div>
                <p>No Items linked yet! Add a bank to get started.</p>
              </div>
            )}
          </AppShell.Section>
        </AppShell.Navbar>
      )}

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
