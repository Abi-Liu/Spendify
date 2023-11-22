/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, Dispatch, useContext } from "react";
import api from "../utils/axios";

interface UserState {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

interface initialStateType {
  user: UserState | null;
}

const initialState: initialStateType = { user: null };

type UserActions = { type: "LOGIN"; payload: UserState } | { type: "LOGOUT" };

const reducer = (state: UserState | null, action: UserActions) => {
  switch (action.type) {
    case "LOGIN":
      // updates the global user state with the payload data
      return action.payload;
    case "LOGOUT":
      // set user state to null
      return null;
    default:
      return state;
  }
};

interface UserContextShape extends initialStateType {
  dispatch: Dispatch<UserActions>;
  login: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextShape>({
  user: null,
  dispatch: () => {},
  login: () => {},
  logout: () => {},
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, dispatch] = useReducer(reducer, initialState.user);

  const login = async () => {
    const { data } = await api.get("/auth/login/success");
    const payload = data.user;
    dispatch({
      type: "LOGIN",
      payload: payload,
    });
  };

  const logout = async () => {
    await api.get("/auth/logout");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, dispatch }}>
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
