import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkError,
} from "react-plaid-link";
import api from "../utils/axios";
import useItemsContext from "../contexts/ItemsContext";
import { useEffect } from "react";
import useLinkContext from "../contexts/LinkTokenContext";
import useAccountsContext from "../contexts/AccountsContext";
import useInstitutionsContext from "../contexts/InstitutionsContext";

interface Props {
  linkToken: string | null;
  itemId?: number | null;
  userId: number;
}

// open plaid link interface
export default function PlaidLink(props: Props) {
  const { getItemsByUser } = useItemsContext();
  const { deleteItemLinkToken, deleteUserLinkToken } = useLinkContext();

  // define onSuccess, onExit and onEvent functions as configs for Plaid Link creation
  const onSuccess = async (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    if (!props.itemId) {
      await api.post("/plaid/setAccessToken", {
        publicToken,
        institutionId: metadata.institution?.institution_id,
        userId: props.userId,
      });
      // add the new item to the items global state
      await getItemsByUser(props.userId);
      deleteUserLinkToken(props.userId);
    }
    // else {
    //   // we are now in update mode
    //   // TODO: initiate update link flow
    //   deleteItemLinkToken(props.itemId)
    // }
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

  // this will automatically open plaid link when this component is rendered
  useEffect(() => {
    if (ready) {
      open();
    }
  }, [open, ready]);
  return <></>;
}
