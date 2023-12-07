import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkError,
} from "react-plaid-link";
import api from "../utils/axios";
import useItemsContext from "../contexts/ItemsContext";
import useUserContext from "../contexts/UserContext";

interface Props {
  linkToken: string | null;
  itemId?: number | null;
}

export default function PlaidLink(props: Props) {
  const { getItemsByUser } = useItemsContext();
  const { user } = useUserContext();

  // define onSuccess, onExit and onEvent functions as configs for Plaid Link creation
  const onSuccess = async (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    await api.post("/plaid/setAccessToken", {
      publicToken,
      institutionId: metadata.institution?.institution_id,
      userId: user!.id,
    });
    // add the new item to the items global state
    await getItemsByUser(user!.id);
  };

  const onExit = async (
    error: PlaidLinkError | null,
    metadata: PlaidLinkOnExitMetadata
  ) => {
    if (error !== null && error.error_code === "INVALID_LINK_TOKEN") {
      console.log("generate new link token");
    }
    console.log(error);
    console.log(metadata);
  };

  const config: PlaidLinkOptions = {
    token: props.linkToken,
    onSuccess,
    onExit,
    // receivedRedirectUri: window.location.href,
  };

  const { open, ready } = usePlaidLink(config);
  return (
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
}
