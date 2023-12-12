/* eslint-disable react-refresh/only-export-components */
import React, {
  useContext,
  createContext,
  useReducer,
  Dispatch,
  useCallback,
} from "react";
import api from "../utils/axios";

export interface Transactions {
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
  transactions: { [id: number]: Transactions };
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: {},
  loading: false,
  error: null,
};

type TransactionsAction =
  | { type: "SUCCESSFUL_GET"; payload: Transactions[] }
  | { type: "DELETE_BY_ITEM_ID"; payload: number }
  | { type: "REQUEST_TRANSACTIONS" }
  | { type: "ERROR"; payload: string };

const reducer = (state: TransactionsState, action: TransactionsAction) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      // if there are no transactions for an account return the original state
      if (action.payload.length === 0) {
        return state;
      }
      const newState = { ...state.transactions };
      action.payload.forEach((transaction) => {
        newState[transaction.id] = transaction;
      });
      return { transactions: newState, loading: false, error: null };
    }

    case "DELETE_BY_ITEM_ID": {
      const newState = { ...state.transactions };
      for (const key in newState) {
        if (newState[key].id === action.payload) {
          delete newState[key];
        }
      }
      return { transactions: newState, loading: false, error: null };
    }

    case "REQUEST_TRANSACTIONS": {
      return { ...state, error: null, loading: true };
    }

    case "ERROR": {
      return { ...state, error: action.payload, loading: false };
    }

    default:
      console.log("unknown action type");
      return state;
  }
};

export interface TransactionsGroup {
  byUserId: { [userId: number]: Transactions[] };
  byItemId: { [itemId: number]: Transactions[] };
  byAccountId: { [accountId: number]: Transactions[] };
}

interface ContextShape extends TransactionsState {
  transactionsState: TransactionsState;
  dispatch: Dispatch<TransactionsAction>;
  getTransactionsByItemId: (
    itemId: number,
    startDate: string,
    endDate: string
  ) => void;
  getTransactionsByAccountId: (accountId: number) => void;
  getTransactionsByUserId: (
    userId: number,
    startDate: string,
    endDate: string
  ) => void;
  deleteTransactionsByItemId: (itemId: number) => void;
  groupTransactions: () => TransactionsGroup;
}

const TransactionsContext = createContext<ContextShape>(
  initialState as ContextShape
);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactionsState, dispatch] = useReducer(reducer, initialState);

  const getTransactionsByItemId = useCallback(
    async (itemId: number, startDate: string, endDate: string) => {
      dispatch({ type: "REQUEST_TRANSACTIONS" });
      try {
        const { data } = await api.get(
          `/transactions/items/${itemId}?startDate=${startDate}&endDate=${endDate}`
        );
        dispatch({ type: "SUCCESSFUL_GET", payload: data });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "ERROR",
          payload: "Failed to fetch transactions for this item",
        });
      }
    },
    []
  );

  const getTransactionsByAccountId = useCallback(async (accountId: number) => {
    dispatch({ type: "REQUEST_TRANSACTIONS" });
    try {
      const { data } = await api.get(`/transactions/accounts/${accountId}`);
      dispatch({ type: "SUCCESSFUL_GET", payload: data });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ERROR",
        payload: "Failed to fetch transactions for this account",
      });
    }
  }, []);

  const getTransactionsByUserId = useCallback(
    async (userId: number, startDate: string, endDate: string) => {
      dispatch({ type: "REQUEST_TRANSACTIONS" });
      try {
        const { data } = await api.get(
          `/transactions/user/${userId}?startDate=${startDate}&endDate=${endDate}`
        );
        dispatch({ type: "SUCCESSFUL_GET", payload: data });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "ERROR",
          payload: "Failed to fetch transactions for user",
        });
      }
    },
    []
  );

  const deleteTransactionsByItemId = useCallback(async (itemId: number) => {
    await api.delete(`/transactions/items/${itemId}`);
    dispatch({ type: "DELETE_BY_ITEM_ID", payload: itemId });
  }, []);

  // groups all transactions into a map
  // groups them by userid, accountid, and itemid for easy use.
  const groupTransactions = useCallback(() => {
    const res: TransactionsGroup = {
      byUserId: {},
      byItemId: {},
      byAccountId: {},
    };
    const transactionsArray = Object.values(transactionsState.transactions);

    for (const transaction of transactionsArray) {
      const { user_id, item_id, account_id } = transaction;

      if (res.byUserId[user_id]) {
        res.byUserId[user_id].push(transaction);
      } else {
        res.byUserId[user_id] = [transaction];
      }

      if (res.byItemId[item_id]) {
        res.byItemId[item_id].push(transaction);
      } else {
        res.byItemId[item_id] = [transaction];
      }

      if (res.byAccountId[account_id]) {
        res.byAccountId[account_id].push(transaction);
      } else {
        res.byAccountId[account_id] = [transaction];
      }
    }
    return res;
  }, [transactionsState.transactions]);

  return (
    <TransactionsContext.Provider
      value={{
        transactionsState,
        error: transactionsState.error,
        loading: transactionsState.loading,
        transactions: transactionsState.transactions,
        getTransactionsByAccountId,
        getTransactionsByItemId,
        getTransactionsByUserId,
        deleteTransactionsByItemId,
        dispatch,
        groupTransactions,
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
