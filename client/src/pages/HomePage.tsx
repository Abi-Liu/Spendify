import Appshell from "../components/Appshell";
import { Container, Divider, Group } from "@mantine/core";
import Hero from "../components/Homepage/Hero";
import PitchCard from "../components/Homepage/PitchCard";
import InfoCards from "../components/Homepage/InfoCards";
import FinalPitch from "../components/Homepage/FinalPitch";
import Footer from "../components/Homepage/Footer";

const HomePage = () => {
  return (
    <Appshell showNav={false}>
      <Container size="80%">
        <Hero />
        <Group pt="9rem" justify="center">
          <PitchCard />
        </Group>
        <InfoCards />
        <FinalPitch />
        <Divider w="100%" />
        <Footer />
      </Container>
    </Appshell>
  );
};

export default HomePage;
