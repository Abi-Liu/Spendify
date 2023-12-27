/* eslint-disable react-refresh/only-export-components */
import React, {
  useContext,
  createContext,
  useReducer,
  useCallback,
} from "react";
import api from "../utils/axios";

export interface Asset {
  id: number;
  value: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface InitialState {
  [id: number]: Asset;
}

const initialState: InitialState = {};

// TODO: ADD A MODIFIED TYPE TO ALLOW USERS TO EDIT ASSETS
type AssetActions =
  | { type: "SUCCESSFUL_GET"; payload: Asset[] }
  | { type: "DELETE"; payload: number };

const reducer = (state: InitialState, action: AssetActions) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      const newState = { ...state };
      action.payload.forEach((asset) => {
        newState[asset.id] = asset;
      });
      return newState;
    }

    case "DELETE": {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
  }
};

interface AssetsContextShape extends InitialState {
  assets: InitialState;
  getUserAssets: (userId: number) => void;
  createAsset: (
    userId: number,
    value: number,
    name: string,
    description?: string
  ) => void;
  deleteAsset: (id: number) => void;
}

const AssetsContext = createContext<AssetsContextShape>(
  initialState as AssetsContextShape
);

export const AssetsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [assets, dispatch] = useReducer(reducer, initialState);

  const getUserAssets = useCallback(async (userId: number) => {
    const { data } = await api.get(`/assets/${userId}`);
    if (data.length > 0) {
      dispatch({ type: "SUCCESSFUL_GET", payload: data });
    }
  }, []);

  const createAsset = useCallback(
    async (
      userId: number,
      value: number,
      name: string,
      description?: string
    ) => {
      const { data } = await api.post(`/assets/`, {
        userId,
        value,
        name,
        description,
      });
      dispatch({ type: "SUCCESSFUL_GET", payload: data });
    },
    []
  );

  const deleteAsset = useCallback(async (id: number) => {
    await api.delete(`/assets/${id}`);
    dispatch({ type: "DELETE", payload: id });
  }, []);

  return (
    <AssetsContext.Provider
      value={{ assets, createAsset, getUserAssets, deleteAsset }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export default function useAssetsContext() {
  const context = useContext(AssetsContext);

  if (!context) {
    throw new Error("useAssetsContext must be used within a AssetsContext");
  }
  return context;
}
