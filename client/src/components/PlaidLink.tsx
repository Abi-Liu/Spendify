import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkError,
} from "react-plaid-link";
import api from "../utils/axios";

interface Props {
  linkToken: string | null;
  userId: number;
  itemId?: number | null;
}

export default function PlaidLink(props: Props) {
  // define onSuccess, onExit and onEvent functions as configs for Plaid Link creation
  const onSuccess = async (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    console.log(publicToken);
    console.log(metadata);
    await api.post("/plaid/setAccessToken", {
      publicToken,
      institutionId: metadata.institution?.institution_id,
      userId: props.userId,
    });
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
