import { useEffect, useState } from "react";
import PlaidLink from "./components/PlaidLink";
import api from "./utils/axios";
import Login from "./pages/Login";
import FireWebhookTest from "./components/FireWebhookTest";

interface User {
  id: number;
  google_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

function App() {
  const [linkToken, setLinkToken] = useState(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get("/auth/login/success");
        const data = res.data.user;
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
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
      {user && <h1>Welcome {user.first_name}</h1>}
      <Login />
      {user && <PlaidLink linkToken={linkToken} userId={user.id} />}
      <FireWebhookTest />
    </>
  );
}

export default App;
