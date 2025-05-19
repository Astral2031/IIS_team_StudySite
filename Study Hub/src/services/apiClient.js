import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default apiClient;
