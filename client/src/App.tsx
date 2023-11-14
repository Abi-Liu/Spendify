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
    let ignore = false;
    async function createLinkToken() {
      try {
        const response = await api.post("/plaid/createLinkToken", {
          id: `${user?.user_id}`,
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
      <h1>hello</h1>
      {user && <h1>Welcome {user.first_name}</h1>}
      <Login />
      {user && <PlaidLink linkToken={linkToken} userId={user?.user_id} />}
    </>
  );
}

export default App;
