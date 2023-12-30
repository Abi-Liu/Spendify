import { useEffect } from "react";

import useUserContext from "../contexts/UserContext";
import Appshell from "../components/Appshell";
import { Link } from "react-router-dom";
import { Container, Group, Image, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Hero from "../components/Homepage/Hero";
import PitchCard from "../components/Homepage/PitchCard";
import InfoCards from "../components/Homepage/InfoCards";
import FinalPitch from "../components/Homepage/FinalPitch";

const HomePage = () => {
  const { login, user } = useUserContext();

  const isMobile = useMediaQuery(`(max-width: ${em(375)})`);
  const isTablet = useMediaQuery(`(max-width: ${em(834)})`);

  useEffect(() => {
    login();
  }, [login]);

  return (
    <Appshell showNav={!!user}>
      <Container size="80%">
        <Hero />
        <Group pt="9rem" justify="center">
          <PitchCard />
        </Group>
        <InfoCards />
        <FinalPitch />
      </Container>
    </Appshell>
  );
};

export default HomePage;
