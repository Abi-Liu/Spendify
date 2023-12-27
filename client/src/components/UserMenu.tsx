import { FormEvent, useState } from "react";
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
  TextInput,
  NumberInput,
} from "@mantine/core";
import useUserContext from "../contexts/UserContext";
import { TbBuildingBank, TbLogout, TbTrash } from "react-icons/tb";
import { useDisclosure } from "@mantine/hooks";
import useAssetsContext from "../contexts/AssetsContext";
import { notifications } from "@mantine/notifications";
import formatCurrency from "../utils/formatDollar";

const AssetsForm = () => {
  const [value, setValue] = useState<number | string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { createAsset } = useAssetsContext();
  const { user } = useUserContext();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createAsset(user!.id, Number(value), name, description);

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
        <TextInput
          label="Name"
          description="Optional"
          placeholder="e.g 2004 Toyota Camry"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        <Button type="submit">Add asset</Button>
      </Flex>
    </form>
  );
};

const UserMenu = () => {
  const [showAssetsForm, setShowAssetsForm] = useState(false);
  const { user, logout, deleteAccount } = useUserContext();
  const { assets } = useAssetsContext();
  const [assetOpened, { open: assetOpen, close: assetClose }] =
    useDisclosure(false);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure(false);

  return (
    <>
      <Modal opened={assetOpened} onClose={assetClose} title="Assets" centered>
        <Flex direction="column">
          {Object.values(assets).map((asset) => (
            <Group key={asset.id} justify="space-between">
              <Text>{asset.name}</Text>
              <Text>{formatCurrency(Number(asset.value))}</Text>
            </Group>
          ))}
          <Button onClick={() => setShowAssetsForm((prev) => !prev)}>
            Add new asset
          </Button>
        </Flex>
        {showAssetsForm && <AssetsForm />}
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
