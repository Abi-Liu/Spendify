/* eslint-disable react-refresh/only-export-components */
import React, {
  useContext,
  createContext,
  useReducer,
  useCallback,
} from "react";
import api from "../utils/axios";

interface Networth {
  [date: string]: string;
}

const initialState: Networth = {};

type NetworthActions = { type: "SUCCESSFUL_GET"; payload: Networth };

const reducer = (state: Networth, action: NetworthActions) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      return action.payload;
    }
    default:
      console.log("Unknown action type");
      return state;
  }
};

interface ContextShape {
  networth: Networth;
  getNetworth: (userId: number) => void;
  updateNetworth: (userId: number, networth: number) => void;
}

const NetworthContext = createContext<ContextShape>({
  networth: initialState,
  getNetworth: () => {},
  updateNetworth: () => {},
});

export const NetworthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [networth, dispatch] = useReducer(reducer, initialState);

  const getNetworth = useCallback(async (userId: number) => {
    const { data } = await api.get(`/networth/${userId}`);
    dispatch({ type: "SUCCESSFUL_GET", payload: data });
  }, []);

  const updateNetworth = useCallback(
    async (userId: number, networth: number) => {
      const date = new Date().toISOString().split("T")[0];
      const { data } = await api.post("/networth/", {
        userId,
        date,
        networth,
      });
      dispatch({ type: "SUCCESSFUL_GET", payload: data });
    },
    []
  );

  return (
    <NetworthContext.Provider value={{ networth, getNetworth, updateNetworth }}>
      {children}
    </NetworthContext.Provider>
  );
};

export default function useNetworthContext() {
  const context = useContext(NetworthContext);

  if (!context) {
    throw new Error("useNetworthContext must be used within NetworthContext");
  }

  return context;
}
