import api from "../utils/axios";

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
