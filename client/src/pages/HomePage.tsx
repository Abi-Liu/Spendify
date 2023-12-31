import Appshell from "../components/Appshell";
import { Center, Container, Divider, Group, em } from "@mantine/core";
import Hero from "../components/Homepage/Hero";
import PitchCard from "../components/Homepage/PitchCard";
import InfoCards from "../components/Homepage/InfoCards";
import FinalPitch from "../components/Homepage/FinalPitch";
import Footer from "../components/Homepage/Footer";
import { useMediaQuery } from "@mantine/hooks";

const HomePage = () => {
  const isTablet = useMediaQuery(`(max-width: ${em(834)})`);

  return (
    <Appshell showNav={false}>
      <Container size="80%">
        <Hero />
        <Group pt="9rem" justify="center">
          <PitchCard />
        </Group>
        {isTablet ? (
          <Center>
            <InfoCards />
          </Center>
        ) : (
          <InfoCards />
        )}
        <FinalPitch />
        <Divider w="100%" />
        <Footer />
      </Container>
    </Appshell>
  );
};

export default HomePage;
