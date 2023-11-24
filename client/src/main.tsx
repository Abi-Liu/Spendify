import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./contexts/UserContext.tsx";
import { ItemsProvider } from "./contexts/ItemsContext.tsx";
import { AccountsProvider } from "./contexts/AccountsContext.tsx";
import { TransactionsProvider } from "./contexts/TransactionsContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <ItemsProvider>
        <AccountsProvider>
          <TransactionsProvider>
            <App />
          </TransactionsProvider>
        </AccountsProvider>
      </ItemsProvider>
    </UserProvider>
  </React.StrictMode>
);
