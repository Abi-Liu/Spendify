/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, Dispatch, useContext } from "react";

interface UserState {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

const initialState: UserState | null = null;

type UserActions = { type: "LOGIN"; payload: UserState } | { type: "LOGOUT" };

const reducer = (
  state: UserState | null,
  action: UserActions
): UserState | null => {
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

const UserContext = createContext<{
  userState: UserState | null;
  userDispatch: Dispatch<UserActions>;
} | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userState, userDispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
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
