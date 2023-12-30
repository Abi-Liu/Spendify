import { Group, Image, Stack, Text, em } from "@mantine/core";
import Fun from "../../assets/Fun.jpg";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect } from "react";

const FinalPitch = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(415)})`);
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

  let height;
  if (isMobile) {
    height = 200;
  } else if (isTablet) {
    height = 350;
  } else {
    height = imageHeight;
  }

  return (
    <Group
      py={"10rem"}
      align="center"
      justify="space-evenly"
      gap={isTablet ? 48 : 8}
    >
      <Image h={height} w="auto" radius="lg" src={Fun} />
      <Stack w="400px">
        <Text ta={isMobile ? "center" : "left"} c="#F75C4E" size="1rem">
          SAVE MORE TIME
        </Text>
        <Text
          ta={isMobile ? "center" : "left"}
          size={isMobile ? "1.75rem" : "2.25rem"}
        >
          And Boost Productivity
        </Text>
        <Text ta={isMobile ? "center" : "left"} c="dimmed" size="1rem">
          Leave the financial headache to us, so you can spend more time doing
          the things you love
        </Text>
      </Stack>
    </Group>
  );
};

export default FinalPitch;
