import React, {
  useContext,
  useReducer,
  Dispatch,
  createContext,
  Context,
} from "react";
import { Institution } from "plaid";
import api from "../utils/axios";

interface InstitutionState {
  [id: string]: Institution;
}

const initialState: InstitutionState = {};

type InstitutionActions = {
  type: "SUCCESSFUL_GET";
  payload: Institution;
};

const reducer = (state: InstitutionState, action: InstitutionActions) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      if (!action.payload) {
        return state;
      }
      return { ...state, [action.payload.institution_id]: action.payload };
    }
    default:
      console.warn("Unkown action");
      return state;
  }
};

interface InstitutionsContextShape extends InstitutionState {
  institutions: InstitutionState;
  dispatch: Dispatch<InstitutionActions>;
  getInstitutionById: (id: string) => void;
}

const InstitutionsContext = createContext<InstitutionsContextShape>(
  initialState as InstitutionsContextShape
);

export const InstitutionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [institutions, dispatch] = useReducer(reducer, initialState);

  const getInstitutionById = async (id: string) => {
    const { data } = await api.get(`/institutions/${id}`);
    dispatch({ type: "SUCCESSFUL_GET", payload: data });
  };

  return (
    <InstitutionsContext.Provider
      value={{ institutions, dispatch, getInstitutionById }}
    >
      {children}
    </InstitutionsContext.Provider>
  );
};
