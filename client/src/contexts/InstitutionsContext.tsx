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

interface InstitutionsShape {
  byInstitutionId: { [id: string]: Institution };
  byItemId: { [id: number]: Institution };
}
interface InstitutionState {
  institutions: InstitutionsShape;
  loading: boolean;
  error: string | null;
}

const initialState: InstitutionState = {
  institutions: { byInstitutionId: {}, byItemId: {} },
  loading: false,
  error: null,
};

type InstitutionActions =
  | {
      type: "SUCCESSFUL_GET";
      payload: Institution;
      itemId: number;
    }
  | { type: "REQUEST_INSTITUTIONS" }
  | { type: "ERROR"; payload: string };

const reducer = (state: InstitutionState, action: InstitutionActions) => {
  switch (action.type) {
    case "SUCCESSFUL_GET": {
      if (!action.payload) {
        return state;
      }
      return {
        ...state,
        institutions: {
          byInstitutionId: {
            ...state.institutions.byInstitutionId,
            [action.payload.institution_id]: action.payload,
          },
          byItemId: {
            ...state.institutions.byItemId,
            [action.itemId]: action.payload,
          },
        },
        loading: false,
        error: null,
      };
    }
    case "REQUEST_INSTITUTIONS": {
      return { ...state, loading: true, error: null };
    }
    case "ERROR": {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      console.warn("Unkown action");
      return state;
  }
};

interface InstitutionsContextShape {
  institutionsState: InstitutionState;
  institutions: InstitutionsShape;
  loading: boolean;
  error: string | null;
  dispatch: Dispatch<InstitutionActions>;
  getInstitutionById: (id: string, itemId: number) => void;
  formatLogo: (logo: string | null | undefined) => string | null | undefined;
}

const InstitutionsContext = createContext<InstitutionsContextShape>({
  institutionsState: initialState,
  institutions: { byInstitutionId: {}, byItemId: {} },
  loading: false,
  error: null,
  dispatch: () => {},
  getInstitutionById: async () => {},
  formatLogo,
});

export const InstitutionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [institutionsState, dispatch] = useReducer(reducer, initialState);

  const getInstitutionById = useCallback(async (id: string, itemId: number) => {
    dispatch({ type: "REQUEST_INSTITUTIONS" });
    try {
      const { data } = await api.get(`/institutions/${id}`);
      dispatch({ type: "SUCCESSFUL_GET", payload: data.institution, itemId });
    } catch (error) {
      console.log(error);
      dispatch({ type: "ERROR", payload: "Failed to get institution data" });
    }
  }, []);

  return (
    <InstitutionsContext.Provider
      value={{
        institutionsState,
        institutions: institutionsState.institutions,
        error: institutionsState.error,
        loading: institutionsState.loading,
        dispatch,
        getInstitutionById,
        formatLogo,
      }}
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
