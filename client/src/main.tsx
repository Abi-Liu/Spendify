import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./contexts/UserContext.tsx";
import { ItemsProvider } from "./contexts/ItemsContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <ItemsProvider>
        <App />
      </ItemsProvider>
    </UserProvider>
  </React.StrictMode>
);
