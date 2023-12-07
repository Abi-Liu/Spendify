/* eslint-disable react-refresh/only-export-components */
import React, {
  Dispatch,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { PlaidLinkError } from "react-plaid-link";
import api from "../utils/axios";

interface LinkToken {
  [id: number]: string;
}

interface LinkState {
  byUser: LinkToken;
  byItem: LinkToken;
  error: PlaidLinkError | object;
}

const initialState: LinkState = {
  byUser: {},
  byItem: {},
  error: {},
};

type LinkActions =
  | { type: "LINK_TOKEN_CREATED"; id: number; token: string }
  | { type: "LINK_UPDATE_MODE"; id: number; token: string }
  | { type: "DELETE_USER_LINK_TOKEN"; id: number }
  | { type: "DELETE_ITEM_LINK_TOKEN"; id: number }
  | { type: "LINK_ERROR"; error: PlaidLinkError };

function reducer(state: LinkState, action: LinkActions) {
  switch (action.type) {
    case "LINK_TOKEN_CREATED":
      return {
        ...state,
        byUser: { [action.id]: action.token },
        error: {},
      };
    case "LINK_UPDATE_MODE":
      return {
        ...state,
        byItem: { ...state.byItem, [action.id]: action.token },
        error: {},
      };
    case "DELETE_ITEM_LINK_TOKEN":
      return {
        ...state,
        byItem: { ...state.byItem, [action.id]: "" },
      };
    case "DELETE_USER_LINK_TOKEN":
      return {
        ...state,
        byUser: { ...state.byUser, [action.id]: "" },
      };
    case "LINK_ERROR":
      return {
        ...state,
        error: action.error,
      };
  }
}

interface LinkContextShape {
  linkTokens: LinkState;
  dispatch: Dispatch<LinkActions>;
  generateUserLinkToken: (id: number) => void;
  generateItemLinkToken: (userId: number, itemId: number) => void;
  deleteItemLinkToken: (id: number) => void;
  deleteUserLinkToken: (id: number) => void;
}

const LinkContext = createContext<LinkContextShape>({
  linkTokens: initialState,
  dispatch: () => {},
  generateUserLinkToken: () => {},
  generateItemLinkToken: () => {},
  deleteItemLinkToken: () => {},
  deleteUserLinkToken: () => {},
});

export const LinkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [linkTokens, dispatch] = useReducer(reducer, initialState);

  const generateUserLinkToken = useCallback(async (id: number) => {
    const { data } = await api.post("/plaid/createLinkToken", { id });
    if (data.link_token) {
      dispatch({ type: "LINK_TOKEN_CREATED", id, token: data.link_token });
    } else {
      dispatch({ type: "LINK_ERROR", error: data });
      console.log("link error", data);
    }
  }, []);

  const generateItemLinkToken = useCallback(
    async (userId: number, itemId: number) => {
      const { data } = await api.post("/plaid/createLinkToken", {
        id: userId,
        itemId,
      });
      if (data.link_token) {
        dispatch({
          type: "LINK_TOKEN_CREATED",
          id: itemId,
          token: data.link_token,
        });
      } else {
        dispatch({ type: "LINK_ERROR", error: data });
        console.log("link error", data);
      }
    },
    []
  );

  const deleteUserLinkToken = useCallback((id: number) => {
    dispatch({ type: "DELETE_USER_LINK_TOKEN", id });
  }, []);

  const deleteItemLinkToken = useCallback((id: number) => {
    dispatch({ type: "DELETE_ITEM_LINK_TOKEN", id });
  }, []);

  return (
    <LinkContext.Provider
      value={{
        linkTokens,
        dispatch,
        generateItemLinkToken,
        generateUserLinkToken,
        deleteItemLinkToken,
        deleteUserLinkToken,
      }}
    >
      {children}
    </LinkContext.Provider>
  );
};

export default function useLinkContext() {
  const context = useContext(LinkContext);

  if (!context) {
    throw new Error("useLinkContext must be used within a LinkProvider");
  }
  return context;
}
