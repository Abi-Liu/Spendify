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
import "@mantine/notifications/styles.css";
import { BrowserRouter } from "react-router-dom";
import { LinkProvider } from "./contexts/LinkTokenContext.tsx";
import { Notifications } from "@mantine/notifications";
import { BudgetsProvider } from "./contexts/BudgetsContext.tsx";
import { AssetsProvider } from "./contexts/AssetsContext.tsx";
import { NetworthProvider } from "./contexts/NetworthContext.tsx";

//
const theme = createTheme({
  primaryColor: "custom",
  colors: {
    custom: [
      "#18A8A8",
      "#1ce3e5",
      "#108a8b",
      "#18A8A8",
      "#18A8A8",
      "#18A8A8",
      "#18A8A8",
      "#18A8A8",
      "#18A8A8",
      "#18A8A8",
    ],
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <ItemsProvider>
        <AccountsProvider>
          <TransactionsProvider>
            <InstitutionsProvider>
              <BudgetsProvider>
                <AssetsProvider>
                  <LinkProvider>
                    <NetworthProvider>
                      <BrowserRouter>
                        <MantineProvider theme={theme}>
                          <Notifications />
                          <App />
                        </MantineProvider>
                      </BrowserRouter>
                    </NetworthProvider>
                  </LinkProvider>
                </AssetsProvider>
              </BudgetsProvider>
            </InstitutionsProvider>
          </TransactionsProvider>
        </AccountsProvider>
      </ItemsProvider>
    </UserProvider>
  </React.StrictMode>
);
