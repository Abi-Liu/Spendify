import { ActionIcon, Group, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(415)})`);
  function linkedIn() {
    window.open("https://www.linkedin.com/in/abiliu/", "_blank", "noreferrer");
  }
  function github() {
    window.open("https://github.com/Abi-Liu/Spendify", "_blank", "noreferrer");
  }

  return (
    <Group
      justify={isMobile ? "center" : "space-between"}
      align="center"
      h={100}
      px={"3rem"}
    >
      <Text ta={isMobile ? "center" : "left"}>
        © 2023 Abi Liu. All Rights Reserved.
      </Text>
      <Group>
        <ActionIcon c="inherit" variant="subtle" onClick={linkedIn}>
          <FaLinkedin size={25} />
        </ActionIcon>
        <ActionIcon c="inherit" variant="subtle" onClick={github}>
          <FaGithub size={25} />
        </ActionIcon>
      </Group>
    </Group>
  );
};

export default Footer;
