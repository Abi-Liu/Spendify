/* eslint-disable react-refresh/only-export-components */
import React, {
  useReducer,
  useContext,
  createContext,
  Dispatch,
  useCallback,
} from "react";
import api from "../utils/axios";

export interface Item {
  id: number;
  user_id: number;
  plaid_institution_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ItemsState {
  items: { [itemId: number]: Item };
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: {},
  loading: false,
  error: null,
};

type ItemActions =
  | { type: "SUCCESSFUL_GET"; payload: Item[] }
  | { type: "DELETE"; payload: number }
  | { type: "REQUEST_ITEMS" }
  | { type: "ERROR"; payload: string };

const reducer = (state: ItemsState, action: ItemActions) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      // adds all new items to the state object
      const newItems = { ...state.items };
      action.payload.forEach((item) => {
        newItems[item.id] = item;
      });
      return { items: newItems, loading: false, error: null };
    }

    case "DELETE": {
      // deletes the entry where key = action.payload
      const newItems = { ...state.items };
      delete newItems[action.payload];
      return { items: newItems, loading: false, error: null };
    }
    case "REQUEST_ITEMS": {
      return { ...state, loading: true, error: null };
    }
    case "ERROR": {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      console.log("unknown action");
      return state;
  }
};

interface ItemsContextShape extends ItemsState {
  itemsState: ItemsState;
  dispatch: Dispatch<ItemActions>;
  deleteItemById: (id: number) => void;
  getItemById: (id: number) => void;
  getItemsByUser: (userId: number) => void;
  itemsArray: Item[];
}

const ItemsContext = createContext<ItemsContextShape>(
  initialState as ItemsContextShape
);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [itemsState, dispatch] = useReducer(reducer, initialState);

  const getItemById = useCallback(async (id: number) => {
    dispatch({ type: "REQUEST_ITEMS" });
    try {
      const { data } = await api.get(`/items/${id}`);
      dispatch({ type: "SUCCESSFUL_GET", payload: data });
    } catch (error) {
      dispatch({ type: "ERROR", payload: "Failed to fetch item" });
    }
  }, []);

  const getItemsByUser = useCallback(async (userId: number) => {
    dispatch({ type: "REQUEST_ITEMS" });
    try {
      const { data } = await api.get(`/items/user/${userId}`);
      dispatch({ type: "SUCCESSFUL_GET", payload: data });
    } catch (error) {
      dispatch({ type: "ERROR", payload: "Failed to fetch items" });
    }
  }, []);

  const deleteItemById = useCallback(async (id: number) => {
    await api.delete(`/items/${id}`);
    dispatch({ type: "DELETE", payload: id });
  }, []);

  return (
    <ItemsContext.Provider
      value={{
        itemsState: itemsState,
        items: itemsState.items,
        loading: itemsState.loading,
        error: itemsState.error,
        deleteItemById,
        getItemById,
        getItemsByUser,
        dispatch,
        itemsArray: Object.values(itemsState.items),
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export default function useItemsContext() {
  const context = useContext(ItemsContext);

  if (!context) {
    throw new Error("useItemsContext must be used within a ItemsProvider");
  }
  return context;
}
