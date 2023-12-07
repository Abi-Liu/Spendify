import React from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Button,
  Flex,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { TbSunHigh, TbMoon } from "react-icons/tb";

export default function Appshell({
  children,
  showNav,
}: {
  children: React.ReactNode;
  showNav: boolean;
}) {
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark");

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

      {showNav && <AppShell.Navbar p="md">Navbar</AppShell.Navbar>}

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
