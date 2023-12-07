import { useEffect, useState } from "react";
import PlaidLink from "./components/PlaidLink";
import api from "./utils/axios";
import FireWebhookTest from "./components/FireWebhookTest";
import Sockets from "./components/Sockets";
import ItemCard from "./components/Items";
import Dashboard from "./pages/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import useUserContext from "./contexts/UserContext";

function App() {
  const [linkToken, setLinkToken] = useState(null);
  const { user } = useUserContext();

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

  console.log(user);

  return (
    <>
      {/* <Sockets />
      {user && <h1>Welcome {user.first_name}</h1>}
      <Login />
      {user && <PlaidLink linkToken={linkToken} userId={user.id} />}
      <FireWebhookTest />
      <Dashboard />
      <ItemCard /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        {/* <Route path="/transactions" element={user ? <Transactions /> : <Navigate to ='/' />} /> */}
      </Routes>
    </>
  );
}

export default App;
