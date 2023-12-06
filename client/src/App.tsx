import { useEffect, useState } from "react";
import PlaidLink from "./components/PlaidLink";
import api from "./utils/axios";
import Login from "./pages/Login";
import FireWebhookTest from "./components/FireWebhookTest";
import Sockets from "./components/Sockets";
import useUserContext from "./contexts/UserContext";
import ItemCard from "./components/Items";
import Dashboard from "./pages/Dashboard";

import Demo from "./components/Appshell";
function App() {
  const [linkToken, setLinkToken] = useState(null);
  const { login, user } = useUserContext();

  useEffect(() => {
    login();
  }, []);

  useEffect(() => {
    let ignore = false;
    async function createLinkToken() {
      try {
        const response = await api.post("/plaid/createLinkToken", {
          id: `${user?.id}`,
        });
        console.log(response);
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.log(error);
      }
    }
    if (user && !ignore) {
      createLinkToken();
    }

    return () => {
      ignore = true;
    };
  }, [user]);

  return (
    <>
      {/* <Sockets />
      {user && <h1>Welcome {user.first_name}</h1>}
      <Login />
      {user && <PlaidLink linkToken={linkToken} userId={user.id} />}
      <FireWebhookTest />
      <Dashboard />
      <ItemCard /> */}
      <Demo />
    </>
  );
}

export default App;
