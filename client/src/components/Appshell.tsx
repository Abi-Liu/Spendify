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
  Group,
  Image,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import { TbSunHigh, TbMoon, TbChevronDown } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import useItemsContext from "../contexts/ItemsContext";
import ItemAccordion from "./ItemAccordion";
import useUserContext from "../contexts/UserContext";
import Loading from "./Loading";
import { Outlet, useNavigate } from "react-router-dom";
import FullLogo from "../assets/FullLogo.png";
import UserMenu from "./UserMenu";
import SectionHeader from "./SectionHeader";

export default function Appshell({
  children,
  showNav,
}: {
  children?: React.ReactNode;
  showNav: boolean;
}) {
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark");
  const { itemsArray, loading: itemsLoading } = useItemsContext();
  const { user } = useUserContext();

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

  function google() {
    window.open("http://localhost:8000/auth/google", "_self");
  }

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
            <UnstyledButton onClick={() => navigate("/")}>
              <Image src={FullLogo} fit="contain" h={52} w={140} />
            </UnstyledButton>
          </Group>
          <Group gap={0}>
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
            {showNav && (
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
            )}

            {!user && (
              <Button
                bg={computedColorScheme === "dark" ? "#25262B" : "#F5F6FB"}
                c="inherit"
                fw={400}
                radius="lg"
                onClick={google}
              >
                <Group gap={5}>
                  <FcGoogle />
                  Sign in
                </Group>
              </Button>
            )}

            <Button onClick={toggleColorScheme} size="sm" variant="subtle">
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
                <SectionHeader />
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
                <Flex justify="flex-end" align="center">
                  <UserMenu colorScheme={computedColorScheme} />
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
