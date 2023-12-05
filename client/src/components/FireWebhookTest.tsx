import React from "react";
import api from "../utils/axios";
import useUserContext from "../contexts/UserContext";

const FireWebhookTest = () => {
  async function fireTestWebhook() {
    const res = await api.post("/webhook/fireTestWebhook", {});
    console.log(res);
  }

  return (
    <div>
      <button onClick={fireTestWebhook}>send webhook</button>
    </div>
  );
};

export default FireWebhookTest;
