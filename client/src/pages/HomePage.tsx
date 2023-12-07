import React, { useEffect } from "react";
import Login from "./login";
import useUserContext from "../contexts/UserContext";
import Appshell from "../components/Appshell";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { login, user } = useUserContext();

  useEffect(() => {
    login();
  }, []);

  return (
    <Appshell showNav={false}>
      <div>
        <Login />
        {user && <Link to="/dashboard">Go to dashboard</Link>}
      </div>
    </Appshell>
  );
};

export default HomePage;
