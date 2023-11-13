import { useEffect, useState } from "react";
import PlaidLink from "./components/PlaidLink";
import api from "./utils/axios";
import Login from "./pages/Login";

interface User {
  user_id: number;
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
    async function createLinkToken() {
      const response = await api.post("/plaid/createLinkToken", {
        id: `${user?.user_id}`,
      });
      console.log(response);
      setLinkToken(response.data.link_token);
    }
    if (user) {
      createLinkToken();
    }
  }, [user]);

  return (
    <>
      {user && <h1>Welcome {user.first_name}</h1>}
      <Login />
      {user && <PlaidLink linkToken={linkToken} userId={user?.user_id} />}
    </>
  );
}

export default App;
