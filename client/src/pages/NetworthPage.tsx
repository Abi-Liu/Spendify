import { Center, Container } from "@mantine/core";
import NetworthChart from "../components/NetworthChart";

const NetworthPage = () => {
  return (
    <Container size="xl">
      <Container size="xl" h="350px">
        <NetworthChart />
      </Container>
    </Container>
  );
};

export default NetworthPage;
