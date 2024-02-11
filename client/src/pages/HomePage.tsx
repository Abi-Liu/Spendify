import Appshell from "../components/Appshell";
import { Center, Container, Divider, Group, em } from "@mantine/core";
import Hero from "../components/homepage/Hero";
import PitchCard from "../components/homepage/PitchCard";
import InfoCards from "../components/homepage/InfoCards";
import FinalPitch from "../components/homepage/FinalPitch";
import Footer from "../components/homepage/Footer";
import { useMediaQuery } from "@mantine/hooks";
import { Helmet } from "react-helmet";

const Homepage = () => {
  const isTablet = useMediaQuery(`(max-width: ${em(834)})`);

  return (
    <>
      <Helmet>
        <title>BudgetBuddy</title>
        <meta
          name="description"
          content="Take control of your finances with our personal finance app. Automate expense tracking, create monthly budgets, and monitor your net worth. Simplify financial management with powerful accounting features. Start your journey to financial wellness today."
        />
      </Helmet>
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
    </>
  );
};

export default Homepage;
