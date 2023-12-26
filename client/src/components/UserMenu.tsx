import { Avatar, Menu, UnstyledButton, Tooltip } from "@mantine/core";
import useUserContext from "../contexts/UserContext";
import { TbBuildingBank, TbLogout, TbTrash } from "react-icons/tb";

const UserMenu = () => {
  const { user, logout } = useUserContext();

  return (
    <Menu trigger="click" position="top" width={200} shadow="md">
      <Menu.Target>
        <Tooltip label="Settings">
          <UnstyledButton>
            <Avatar src={user!.avatar_url} />
          </UnstyledButton>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Settings</Menu.Label>
        <Menu.Item leftSection={<TbBuildingBank />}>Assets</Menu.Item>
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
  );
};

export default UserMenu;
