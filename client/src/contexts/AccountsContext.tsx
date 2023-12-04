/* eslint-disable react-refresh/only-export-components */
import React, { useContext, createContext, useReducer, Dispatch } from "react";
import api from "../utils/axios";

export interface Account {
  id: number;
  item_id: number;
  user_id: number;
  name: string;
  mask: string;
  official_name: string;
  current_balance: number;
  available_balance: number;
  iso_currency_code: string;
  unofficial_currency_code: string;
  type: "investment" | "credit" | "depository" | "loan";
  subtype: string;
  created_at: string;
  updated_at: string;
}

interface InitialState {
  [accountId: number]: Account;
}

const initialState: InitialState = {};

type AccountActions =
  | { type: "SUCCESSFUL_GET"; payload: Account[] }
  | { type: "DELETE_BY_ITEM"; payload: number };

const reducer = (state: InitialState, action: AccountActions) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      const newAccounts = { ...state };
      action.payload.forEach((account) => {
        newAccounts[account.id] = account;
      });
      return newAccounts;
    }
    case "DELETE_BY_ITEM": {
      const newState = { ...state };
      // loop through the object and delete objects that match the itemId
      for (const key in newState) {
        if (newState[key].item_id === action.payload) {
          delete newState[key];
        }
      }
      return newState;
    }
  }
};

interface ContextShape extends InitialState {
  accounts: InitialState;
  dispatch: Dispatch<AccountActions>;
  getAccountsByItemId: (itemId: number) => void;
  getAccountsByUser: (userId: number) => void;
  deleteAccountsByItemId: (userId: number) => void;
  groupAccountsByItemId: () => { [itemId: string]: Account[] };
}

const AccountsContext = createContext<ContextShape>(
  initialState as ContextShape
);

export const AccountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accounts, dispatch] = useReducer(reducer, initialState);

  const getAccountsByItemId = async (itemId: number) => {
    const { data } = await api.get(`/accounts/item/${itemId}`);
    dispatch({ type: "SUCCESSFUL_GET", payload: data });
  };

  const getAccountsByUser = async (userId: number) => {
    const { data } = await api.get(`/accounts/user/${userId}`);
    console.log("accounts data", data);
    dispatch({ type: "SUCCESSFUL_GET", payload: data });
  };

  const deleteAccountsByItemId = async (itemId: number) => {
    await api.delete(`/accounts/item/${itemId}`);
    dispatch({ type: "DELETE_BY_ITEM", payload: itemId });
  };

  const groupAccountsByItemId = () => {
    const result: { [itemId: string]: Account[] } = {};
    const allAccounts = Object.values(accounts);
    allAccounts.forEach((account) => {
      if (!result[account.item_id]) {
        result[account.item_id] = [account];
      } else {
        result[account.item_id].push(account);
      }
    });
    console.log("result", result);
    return result;
  };

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        getAccountsByItemId,
        getAccountsByUser,
        deleteAccountsByItemId,
        dispatch,
        groupAccountsByItemId,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export default function useAccountsContext() {
  const context = useContext(AccountsContext);

  if (!context) {
    throw new Error("useAccountsContext must be used within a AccountsContext");
  }
  return context;
}
