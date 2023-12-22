/* eslint-disable react-refresh/only-export-components */
import React, {
  useContext,
  createContext,
  useReducer,
  useCallback,
} from "react";
import api from "../utils/axios";

interface Budget {
  id: number;
  user_id: number;
  budget_amount: number;
  total_spending: number;
}

interface InitialState {
  [id: number]: Budget;
}

const initialState: InitialState = {};

type BudgetActions =
  | { type: "SUCCESSFUL_GET"; payload: Budget }
  | { type: "MODIFIED"; payload: Budget }
  | { type: "DELETE"; payload: number };

const reducer = (state: InitialState, action: BudgetActions) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      const newBudget = { ...state };
      newBudget[action.payload.id] = action.payload;
      return newBudget;
    }

    case "MODIFIED": {
      const newBudget = { ...state };
      newBudget[action.payload.id] = action.payload;
      return newBudget;
    }

    case "DELETE": {
      const newBudget = { ...state };
      delete newBudget[action.payload];
      return newBudget;
    }

    default:
      console.log("unknown action");
      return state;
  }
};

interface BudgetContextShape extends InitialState {
  budgets: InitialState;
  getBudgetByUser: (userId: number) => void;
  createBudget: (userId: number, amount: number) => void;
  updateBudget: (budgetId: number, amount: number) => void;
  deleteBudget: (id: number) => void;
}

const BudgetsContext = createContext<BudgetContextShape>(
  initialState as BudgetContextShape
);

export const BudgetsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [budgets, dispatch] = useReducer(reducer, initialState);

  const getBudgetByUser = useCallback(async (userId: number) => {
    const { data } = await api.get(`/budgets/${userId}`);
    // if there is no budget yet for the user we do not want to update state.
    if (data.length !== 0) {
      dispatch({ type: "SUCCESSFUL_GET", payload: data });
    }
  }, []);

  const createBudget = useCallback(async (userId: number, amount: number) => {
    const { data } = await api.post("/budgets", {
      budgetAmount: amount,
      userId,
    });
    dispatch({ type: "SUCCESSFUL_GET", payload: data });
  }, []);

  const updateBudget = useCallback(async (budgetId: number, amount: number) => {
    const { data } = await api.put("/budgets", { budgetId, amount });
    dispatch({ type: "MODIFIED", payload: data });
  }, []);

  const deleteBudget = useCallback((id: number) => {
    dispatch({ type: "DELETE", payload: id });
  }, []);

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        getBudgetByUser,
        createBudget,
        updateBudget,
        deleteBudget,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};

export default function useBudgetsContext() {
  const context = useContext(BudgetsContext);

  if (!context) {
    throw new Error("useAccountsContext must be used within a BudgetsContext");
  }
  return context;
}
