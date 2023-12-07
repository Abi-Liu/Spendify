import { ActionIcon, Menu } from "@mantine/core";
import React from "react";
import { IconType } from "react-icons";
import { TbDots } from "react-icons/tb";

// CAN IMPLEMENT THIS TO DECLUTTER ITEM CARD

interface MenuDotsProps {
  leftSection: IconType;
  component: "string";
  clickFunction: () => void | null;
}
const MenuDots = ({ leftSection, component, clickFunction }) => {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon size="md" variant="subtle" color="gray">
          <TbDots size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown></Menu.Dropdown>
    </Menu>
  );
};

export default MenuDots;
