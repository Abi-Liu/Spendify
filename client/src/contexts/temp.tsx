/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useReducer,
  Dispatch,
  useContext,
  useCallback,
} from "react";
import api from "../utils/axios";

export interface UserState {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  transactions_count: number;
  created_at: string;
  updated_at: string;
}

interface initialStateType {
  user: UserState | null;
}

const initialState: initialStateType = { user: null };

type UserActions =
  | { type: "LOGIN"; payload: UserState }
  | { type: "LOGOUT" }
  | { type: "UPDATE_TRANSACTIONS_COUNT"; payload: number };

const reducer = (state: UserState | null, action: UserActions) => {
  switch (action.type) {
    case "LOGIN":
      // updates the global user state with the payload data
      return action.payload;
    case "LOGOUT":
      // set user state to null
      return null;
    // case "UPDATE_TRANSACTIONS_COUNT": {
    //   return { ...state, transactions_count: action.payload };
    // }
    default:
      console.log("unknown action");
      return state;
  }
};

interface UserContextShape extends initialStateType {
  dispatch: Dispatch<UserActions>;
  login: () => void;
  logout: () => void;
  // updateUserTransactionsCount: (id: number) => void;
  deleteAccount: (id: number) => void;
}

const UserContext = createContext<UserContextShape>(
  initialState as UserContextShape
);

const { VITE_SERVER_URL, VITE_ENV } = import.meta.env;
const apiUrl = VITE_ENV === "dev" ? "http://localhost:8000" : VITE_SERVER_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, dispatch] = useReducer(reducer, initialState.user);

  const login = useCallback(async () => {
    const { data } = await api.get("/auth/login/success");
    const payload = data.user;
    dispatch({
      type: "LOGIN",
      payload: payload,
    });
  }, []);

  const logout = useCallback(async () => {
    window.open(`${apiUrl}/auth/logout`, "_self");
    dispatch({ type: "LOGOUT" });
  }, []);

  const deleteAccount = useCallback(async (id: number) => {
    window.open(`${apiUrl}/auth/logout`, "_self");
    await api.delete(`/auth/deleteUser/${id}`);
    dispatch({ type: "LOGOUT" });
  }, []);

  // const updateUserTransactionsCount = useCallback(async (id: number) => {
  //   const { data } = await api.get(`/users/${id}`);
  //   const payload = data.transactionsCount;
  //   dispatch({ type: "UPDATE_TRANSACTIONS_COUNT", payload });
  // }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        dispatch,
        deleteAccount,
        // updateUserTransactionsCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
