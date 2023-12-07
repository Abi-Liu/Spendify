import Sockets from "./components/Sockets";
import Dashboard from "./pages/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import useUserContext from "./contexts/UserContext";

function App() {
  const { user } = useUserContext();

  return (
    <>
      <Sockets />
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
