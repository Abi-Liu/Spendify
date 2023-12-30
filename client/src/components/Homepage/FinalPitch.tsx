import { Container, Group, Image, Stack, Text, em } from "@mantine/core";
import Fun from "../../assets/Fun.jpg";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect } from "react";

const FinalPitch = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(375)})`);
  const isTablet = useMediaQuery(`(max-width: ${em(834)})`);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowWidth);
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  const imageHeight = windowWidth < 1400 ? (windowWidth / 400) * 100 : 400;

  return (
    <Group
      py={"10rem"}
      align="center"
      justify="space-evenly"
      gap={isTablet ? 48 : 8}
    >
      <Image h={isTablet ? 350 : imageHeight} w="auto" radius="lg" src={Fun} />
      <Stack w="400px">
        <Text c="#F75C4E" size="1rem">
          SAVE MORE TIME
        </Text>
        <Text size={isMobile ? "1.75rem" : "2.25rem"}>
          And Boost Productiviy
        </Text>
        <Text c="dimmed" size="1rem">
          Leave the financial headache to us, so you can spend more time doing
          things you love
        </Text>
      </Stack>
    </Group>
  );
};

export default FinalPitch;
