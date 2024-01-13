import axios from "axios";

const { VITE_SERVER_URL, VITE_ENV } = import.meta.env;

const apiUrl = VITE_ENV === "dev" ? "http://localhost:8000" : VITE_SERVER_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default api;
