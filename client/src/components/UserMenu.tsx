import {
  Avatar,
  Menu,
  UnstyledButton,
  Tooltip,
  Modal,
  Group,
  Button,
  Text,
  Flex,
  Input,
  NumberInput,
} from "@mantine/core";
import useUserContext from "../contexts/UserContext";
import { TbBuildingBank, TbLogout, TbTrash } from "react-icons/tb";
import { useDisclosure } from "@mantine/hooks";
import { ChangeEvent, useState } from "react";

const AssetsForm = () => {
  const [value, setValue] = useState<number | string>("");
  const [name, setName] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setName(value);
  }

  return (
    <form>
      <Flex direction="column" gap={16}>
        <Input.Wrapper label="Name">
          <Input
            type="text"
            onChange={handleChange}
            value={name}
            placeholder="e.g Car"
          />
        </Input.Wrapper>
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
        <Button type="submit">Add asset</Button>
      </Flex>
    </form>
  );
};

const UserMenu = () => {
  const { user, logout, deleteAccount } = useUserContext();
  const [assetOpened, { open: assetOpen, close: assetClose }] =
    useDisclosure(false);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure(false);

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

      <Menu position="top" shadow="md">
        <Menu.Target>
          <Tooltip label="Settings">
            <UnstyledButton>
              <Avatar src={user!.avatar_url} />
            </UnstyledButton>
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Settings</Menu.Label>
          <Menu.Item leftSection={<TbBuildingBank />} onClick={assetOpen}>
            Assets
          </Menu.Item>
          <Menu.Item leftSection={<TbLogout />} onClick={logout}>
            Logout
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item color="red" leftSection={<TbTrash />} onClick={deleteOpen}>
            Delete my account
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default UserMenu;
