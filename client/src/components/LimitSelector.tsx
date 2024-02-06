import { Combobox, InputBase, useCombobox } from "@mantine/core";
import { SetStateAction, Dispatch } from "react";

interface LimitSelectorProps {
  optionsArray: string[];
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
}
const LimitSelector = ({
  optionsArray,
  limit,
  setLimit,
}: LimitSelectorProps) => {
  // COMBO BOX
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = optionsArray.map((option) => (
    <Combobox.Option value={option} key={option}>
      {option}
    </Combobox.Option>
  ));
  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setLimit(Number(val));
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {limit}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default LimitSelector;
