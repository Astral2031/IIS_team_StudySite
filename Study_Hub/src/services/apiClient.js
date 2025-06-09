import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api"
});

apiClient.interceptors.request.use((config) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser?.user?.token) {
    config.headers.Authorization = `Bearer ${currentUser.user.token}`;
  }
  return config;
});

export default apiClient;
