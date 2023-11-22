import React, { useReducer, useContext, createContext, Dispatch } from "react";
import api from "../utils/axios";

interface Item {
  id: number;
  user_id: number;
  plaid_institution_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ItemsState {
  [itemId: number]: Item;
}

const initialState: ItemsState = {};

type ItemActions =
  | { type: "SUCCESSFUL_GET"; payload: Item[] }
  | { type: "DELETE"; payload: number };

const reducer = (state: ItemsState, action: ItemActions) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      // adds all new items to the state object
      const newItems = { ...state };
      action.payload.forEach((item) => {
        newItems[item.id] = item;
      });
      return newItems;
    }

    case "DELETE": {
      // deletes the entry where key = action.payload
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      console.log("unknown action");
      return state;
  }
};

interface ItemsContextShape extends ItemsState {
  dispatch: Dispatch<ItemActions>;
  deleteItemById: (id: number) => void;
  getItemById: (id: number) => void;
  getItemsByUser: (userId: number) => void;
}

const ItemsContext = createContext<ItemsContextShape>(
  initialState as ItemsContextShape
);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, dispatch] = useReducer(reducer, {});

  const getItemById = async (id: number) => {
    const { data } = api.get(`/items/${id}`);
    dispatch({ type: "SUCCESSFUL_REQUEST", payload: data });
  };
};
