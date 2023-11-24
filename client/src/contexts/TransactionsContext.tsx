/* eslint-disable react-refresh/only-export-components */
import React, { useContext, createContext, useReducer, Dispatch } from "react";
import api from "../utils/axios";

interface Transactions {
  id: number;
  item_id: number;
  account_id: number;
  user_id: number;
  name: string;
  payment_channel: "online" | "in store" | "other";
  date: string;
  personal_finance_category: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

interface TransactionsState {
  [id: number]: Transactions;
}

const initialState: TransactionsState = {};

type TransactionsAction =
  | { type: "SUCCESSFUL_GET"; payload: Transactions[] }
  | { type: "DELETE_BY_ITEM_ID"; payload: number };

const reducer = (state: TransactionsState, action: TransactionsAction) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      const newState = { ...state };
      action.payload.forEach((transaction) => {
        newState[transaction.id] = transaction;
      });
      return newState;
    }

    case "DELETE_BY_ITEM_ID": {
      const newState = { ...state };
      for (const key in newState) {
        if (newState[key].id === action.payload) {
          delete newState[key];
        }
      }
      return newState;
    }

    default:
      console.log("unknown action type");
      return state;
  }
};

interface ContextShape extends TransactionsState {
  transactions: TransactionsState;
  dispatch: Dispatch<TransactionsAction>;
  getTransactionsByItemId: (itemId: number) => void;
  getTransactionsByAccountId: (accountId: number) => void;
  getTransactionsByUserId: (userId: number) => void;
  deleteTransactionsByItemId: (itemId: number) => void;
}

const TransactionsContext = createContext<ContextShape>(
  initialState as ContextShape
);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, dispatch] = useReducer(reducer, initialState);

  const getTransactionsByItemId = async (itemId: number) => {
    const { data } = await api.get(`/transactions/items/${itemId}`);
    dispatch({ type: "SUCCESSFUL_GET", payload: data });
  };

  const getTransactionsByAccountId = async (accountId: number) => {
    const { data } = await api.get(`/transactions/accounts/${accountId}`);
    dispatch({ type: "SUCCESSFUL_GET", payload: data });
  };

  const getTransactionsByUserId = async (userId: number) => {
    const { data } = await api.get(`/transactions/user/${userId}`);
    dispatch({ type: "SUCCESSFUL_GET", payload: data });
  };

  const deleteTransactionsByItemId = async (itemId: number) => {
    await api.delete(`/transactions/items/${itemId}`);
    dispatch({ type: "DELETE_BY_ITEM_ID", payload: itemId });
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        getTransactionsByAccountId,
        getTransactionsByItemId,
        getTransactionsByUserId,
        deleteTransactionsByItemId,
        dispatch,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export default function useTransactionsContext() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      "useTransactionsContext must be used within a TransactionsContext"
    );
  }
  return context;
}
