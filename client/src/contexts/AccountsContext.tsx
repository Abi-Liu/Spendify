/* eslint-disable react-refresh/only-export-components */
import React, {
  useContext,
  createContext,
  useReducer,
  Dispatch,
  useCallback,
} from "react";
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
  transaction_count: number;
  created_at: string;
  updated_at: string;
}

interface InitialState {
  accounts: { [accountId: number]: Account };
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  accounts: {},
  loading: false,
  error: null,
};

type AccountActions =
  | { type: "SUCCESSFUL_GET"; payload: Account[] }
  | { type: "DELETE_BY_ITEM"; payload: number }
  | { type: "REQUEST_ACCOUNTS" }
  | { type: "ERROR"; payload: string };

const reducer = (state: InitialState, action: AccountActions) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      const newAccounts = { ...state.accounts };
      action.payload.forEach((account) => {
        newAccounts[account.id] = account;
      });
      return { accounts: newAccounts, loading: false, error: null };
    }
    case "DELETE_BY_ITEM": {
      const newState = { ...state.accounts };
      // loop through the object and delete objects that match the itemId
      for (const key in newState) {
        if (newState[key].item_id === action.payload) {
          delete newState[key];
        }
      }
      return { accounts: newState, loading: false, error: null };
    }
    case "REQUEST_ACCOUNTS": {
      return { ...state, loading: true, error: null };
    }
    case "ERROR": {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      console.log("Unknown accounts action ");
      return state;
  }
};

interface ContextShape extends InitialState {
  accountsState: InitialState;
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
  const [accountsState, dispatch] = useReducer(reducer, initialState);

  const getAccountsByItemId = useCallback(async (itemId: number) => {
    dispatch({ type: "REQUEST_ACCOUNTS" });
    try {
      const { data } = await api.get(`/accounts/items/${itemId}`);
      dispatch({ type: "SUCCESSFUL_GET", payload: data });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ERROR",
        payload: "Failed to fetch accounts for this item",
      });
    }
  }, []);

  const getAccountsByUser = useCallback(async (userId: number) => {
    dispatch({ type: "REQUEST_ACCOUNTS" });
    try {
      const { data } = await api.get(`/accounts/user/${userId}`);
      dispatch({ type: "SUCCESSFUL_GET", payload: data });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ERROR",
        payload: "Failed to fetch accounts for the user",
      });
    }
  }, []);

  const deleteAccountsByItemId = useCallback(async (itemId: number) => {
    await api.delete(`/accounts/items/${itemId}`);
    dispatch({ type: "DELETE_BY_ITEM", payload: itemId });
  }, []);

  const groupAccountsByItemId = useCallback(() => {
    const result: { [itemId: string]: Account[] } = {};
    const allAccounts = Object.values(accountsState.accounts);
    allAccounts.forEach((account) => {
      if (!result[account.item_id]) {
        result[account.item_id] = [account];
      } else {
        result[account.item_id].push(account);
      }
    });
    return result;
  }, [accountsState.accounts]);

  return (
    <AccountsContext.Provider
      value={{
        accountsState,
        accounts: accountsState.accounts,
        loading: accountsState.loading,
        error: accountsState.error,
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
