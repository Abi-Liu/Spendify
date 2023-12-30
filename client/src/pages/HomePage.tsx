import { useEffect } from "react";

import useUserContext from "../contexts/UserContext";
import Appshell from "../components/Appshell";
import { Container, Group } from "@mantine/core";
import Hero from "../components/Homepage/Hero";
import PitchCard from "../components/Homepage/PitchCard";
import InfoCards from "../components/Homepage/InfoCards";
import FinalPitch from "../components/Homepage/FinalPitch";

const HomePage = () => {
  const { login, user } = useUserContext();

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
