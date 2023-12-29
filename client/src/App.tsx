import Sockets from "./components/Sockets";
import Dashboard from "./pages/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BudgetPage from "./pages/BudgetPage";
import useUserContext from "./contexts/UserContext";
import TransactionsPage from "./pages/TransactionsPage";
import Appshell from "./components/Appshell";
import NetworthPage from "./pages/NetworthPage";

function App() {
  const { user } = useUserContext();

  return (
    <>
      <Sockets />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={user ? <Appshell showNav={true} /> : <Navigate to="/" />}
        >
          {/* Nested Routes inside Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="networth" element={<NetworthPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
