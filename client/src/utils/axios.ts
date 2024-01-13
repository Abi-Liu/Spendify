import axios from "axios";

const { VITE_SERVER_URL, VITE_ENV } = import.meta.env;

console.log(VITE_ENV, VITE_SERVER_URL);

const apiUrl = VITE_ENV === "dev" ? "http://localhost:8000" : VITE_SERVER_URL;

console.log(apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default api;
