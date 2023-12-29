import { FormEvent, useState } from "react";
import {
  Avatar,
  Menu,
  UnstyledButton,
  Modal,
  Group,
  Button,
  Text,
  Flex,
  TextInput,
  NumberInput,
} from "@mantine/core";
import useUserContext from "../contexts/UserContext";
import {
  TbBuildingBank,
  TbLogout,
  TbTrash,
  TbChevronRight,
} from "react-icons/tb";
import { useDisclosure, useHover } from "@mantine/hooks";
import useAssetsContext from "../contexts/AssetsContext";
import { notifications } from "@mantine/notifications";

const AssetsForm = () => {
  const [value, setValue] = useState<number | string>("");
  const [name, setName] = useState<string>("");
  const { createAsset } = useAssetsContext();
  const { user } = useUserContext();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createAsset(user!.id, Number(value), name);

    notifications.show({
      message: `Asset added!`,
      color: "green",
    });

    // TODO IMPLEMENT ERROR STATES AND SHOW ERROR NOTIFICATION ON BAD REQUESTS
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap={16}>
        <TextInput
          label="Name"
          placeholder="e.g Car"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <NumberInput
          label="Value"
          placeholder="eg 5,000"
          inputMode="numeric"
          allowNegative={false}
          decimalScale={2}
          thousandSeparator=","
          hideControls
          value={value}
          onChange={setValue}
        />
        <Button type="submit" mb="1rem">
          Add asset
        </Button>
      </Flex>
    </form>
  );
};

interface UserMenuProps {
  colorScheme: string;
}

const UserMenu = ({ colorScheme }: UserMenuProps) => {
  const { user, logout, deleteAccount } = useUserContext();
  const [assetOpened, { open: assetOpen, close: assetClose }] =
    useDisclosure(false);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure(false);
  const { hovered, ref } = useHover();

  return (
    <>
      <Modal opened={assetOpened} onClose={assetClose} title="Assets" centered>
        <AssetsForm />
      </Modal>

      <Modal
        opened={deleteOpened}
        onClose={deleteClose}
        centered
        title="Delete forever?"
      >
        <Flex direction="column" gap={10}>
          <Text>
            You will lose all financial data collected by BudgetBuddy. We cannot
            recover them once the account has been deleted.
          </Text>
          <Text>
            Are you sure you want to{" "}
            <span style={{ color: "red" }}>permanently delete</span> your
            account?
          </Text>
          <Group justify="center">
            <Button color="red" onClick={() => deleteAccount(user!.id)}>
              Confirm
            </Button>
            <Button color="gray" onClick={deleteClose}>
              Cancel
            </Button>
          </Group>
        </Flex>
      </Modal>

      <Menu position="top-end" shadow="md">
        <Menu.Target>
          <UnstyledButton
            component="div"
            ref={ref}
            style={{
              padding: "var(--mantine-spacing-md)",
              color: "var(--mantine-color-text)",
              borderRadius: "var(--mantine-radius-sm)",
              width: "100%",
              backgroundColor: hovered
                ? colorScheme === "dark"
                  ? "#262626"
                  : "#e0e0e0"
                : "",
            }}
          >
            <Group>
              <Avatar src={user!.avatar_url} />
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {user?.first_name} {user?.last_name}
                </Text>

                <Text c="dimmed" size="xs" fw={500}>
                  {user!.email}
                </Text>
              </div>
              <TbChevronRight />
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item color="red" leftSection={<TbTrash />} onClick={deleteOpen}>
            Delete my account
          </Menu.Item>

          <Menu.Label>Settings</Menu.Label>
          <Menu.Item leftSection={<TbBuildingBank />} onClick={assetOpen}>
            Assets
          </Menu.Item>
          <Menu.Item leftSection={<TbLogout />} onClick={logout}>
            Logout
          </Menu.Item>

          <Menu.Divider />
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default UserMenu;
