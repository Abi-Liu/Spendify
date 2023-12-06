import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./contexts/UserContext.tsx";
import { ItemsProvider } from "./contexts/ItemsContext.tsx";
import { AccountsProvider } from "./contexts/AccountsContext.tsx";
import { TransactionsProvider } from "./contexts/TransactionsContext.tsx";
import { InstitutionsProvider } from "./contexts/InstitutionsContext.tsx";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <ItemsProvider>
        <AccountsProvider>
          <TransactionsProvider>
            <InstitutionsProvider>
              <MantineProvider theme={theme}>
                <App />
              </MantineProvider>
            </InstitutionsProvider>
          </TransactionsProvider>
        </AccountsProvider>
      </ItemsProvider>
    </UserProvider>
  </React.StrictMode>
);
