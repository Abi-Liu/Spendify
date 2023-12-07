import React, { useEffect } from "react";
import Login from "./login";
import useUserContext from "../contexts/UserContext";
import Demo from "../components/Appshell";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { login, user } = useUserContext();

  useEffect(() => {
    login();
  }, []);
  console.log(user);
  return (
    <Demo showNav={false}>
      <div>
        <Login />
        {user && <Link to="/dashboard">Go to dashboard</Link>}
      </div>
    </Demo>
  );
};

export default HomePage;
