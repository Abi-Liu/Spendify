import { Avatar, Menu, UnstyledButton, Tooltip, Modal } from "@mantine/core";
import useUserContext from "../contexts/UserContext";
import { TbBuildingBank, TbLogout, TbTrash } from "react-icons/tb";
import { useDisclosure } from "@mantine/hooks";

const UserMenu = () => {
  const { user, logout } = useUserContext();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Assets"></Modal>

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
          <Menu.Item leftSection={<TbBuildingBank />} onClick={open}>
            Assets
          </Menu.Item>
          <Menu.Item leftSection={<TbLogout />} onClick={logout}>
            Logout
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item color="red" leftSection={<TbTrash />}>
            Delete my account
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default UserMenu;
