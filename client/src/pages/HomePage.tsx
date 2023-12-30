import { useEffect } from "react";
import Login from "./Login";
import useUserContext from "../contexts/UserContext";
import Appshell from "../components/Appshell";
import { Link } from "react-router-dom";
import { Container } from "@mantine/core";
import { Label } from "../components/Homepage/Label";

const HomePage = () => {
  const { login, user } = useUserContext();

  useEffect(() => {
    login();
  }, [login]);

  return (
    <Appshell showNav={!!user}>
      <Container size="85%">
        <Label />
      </Container>
    </Appshell>
  );
};

export default HomePage;
