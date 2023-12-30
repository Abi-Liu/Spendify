import React, { useEffect } from "react";
import { Label } from "./Label";
import { Group, Image, em } from "@mantine/core";
import LandingImage from "../../assets/Landing.jpg";
import { useMediaQuery } from "@mantine/hooks";

const Hero = () => {
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

  const imageHeight = windowWidth < 1400 ? (windowWidth / 500) * 100 : 400;

  const isMobile = useMediaQuery(`(max-width: ${em(375)})`);
  const isTablet = useMediaQuery(`(max-width: ${em(834)})`);

  let justify;
  if (isMobile) {
    justify = "flex-start";
  } else if (isTablet && !isMobile) {
    justify = "center";
  } else {
    justify = "space-around";
  }

  return (
    <Group w={"100%"} justify={justify} wrap="nowrap" pt={"5rem"}>
      <Label />
      <Image
        height={imageHeight}
        w={"auto"}
        display={isTablet ? "none" : ""}
        src={LandingImage}
        radius="xl"
      />
    </Group>
  );
};

export default Hero;
