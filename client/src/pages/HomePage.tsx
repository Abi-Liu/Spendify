import { useEffect } from "react";
import Login from "./Login";
import useUserContext from "../contexts/UserContext";
import Appshell from "../components/Appshell";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { login, user } = useUserContext();

  useEffect(() => {
    login();
  }, [login]);

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
