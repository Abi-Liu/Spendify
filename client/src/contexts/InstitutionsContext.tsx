/* eslint-disable react-refresh/only-export-components */
import React, {
  useContext,
  useReducer,
  Dispatch,
  createContext,
  useCallback,
} from "react";
import { Institution } from "plaid";
import api from "../utils/axios";

interface InstitutionState {
  byInstitutionId: { [id: string]: Institution };
  byItemId: { [id: number]: Institution };
}

const initialState: InstitutionState = {
  byInstitutionId: {},
  byItemId: {},
};

type InstitutionActions = {
  type: "SUCCESSFUL_GET";
  payload: Institution;
  itemId: number;
};

const reducer = (state: InstitutionState, action: InstitutionActions) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      if (!action.payload) {
        return state;
      }
      return {
        ...state,
        byInstitutionId: {
          ...state.byInstitutionId,
          [action.payload.institution_id]: action.payload,
        },
        byItemId: { ...state.byItemId, [action.itemId]: action.payload },
      };
    }
    default:
      console.warn("Unkown action");
      return state;
  }
};

interface InstitutionsContextShape {
  institutions: InstitutionState;
  dispatch: Dispatch<InstitutionActions>;
  getInstitutionById: (id: string, itemId: number) => void;
  formatLogo: (logo: string | null | undefined) => string | null | undefined;
}

const InstitutionsContext = createContext<InstitutionsContextShape>({
  institutions: initialState,
  dispatch: () => {},
  getInstitutionById: async () => {},
  formatLogo,
});

export const InstitutionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [institutions, dispatch] = useReducer(reducer, initialState);

  const getInstitutionById = useCallback(async (id: string, itemId: number) => {
    const { data } = await api.get(`/institutions/${id}`);
    dispatch({ type: "SUCCESSFUL_GET", payload: data.institution, itemId });
  }, []);

  return (
    <InstitutionsContext.Provider
      value={{ institutions, dispatch, getInstitutionById, formatLogo }}
    >
      {children}
    </InstitutionsContext.Provider>
  );
};

export default function useInstitutionsContext() {
  const context = useContext(InstitutionsContext);

  if (!context) {
    throw new Error(
      "useInstitutionsContext must be used within a ItemsProvider"
    );
  }
  return context;
}

function formatLogo(logo: string | null | undefined) {
  return logo && `data:image/png;base64,${logo}`;
}
