import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 요청 가로채기(interceptor) 설정
apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;  // 토큰 넣기
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
