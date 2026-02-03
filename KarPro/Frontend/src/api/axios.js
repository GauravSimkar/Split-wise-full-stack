import axios from "axios";

const api = axios.create({
  baseURL: "https://split-wise-full-stack-z7nq-bd8ki7guf-gaurav-simkars-projects.vercel.app/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
