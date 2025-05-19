import apiClient from "./apiClient.js";
import axios from "axios";

const API_URL = "/api/auth";

const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const userInfo = response.data;

      // 로그인 성공 시 localStorage에 토큰 포함해서 저장
      localStorage.setItem("currentUser", JSON.stringify(userInfo));

      return userInfo;
    } catch (err) {
      if (err.response && err.response.data.message) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error("로그인 중 오류가 발생했습니다.");
      }
    }
  },
  logout: () => {
    localStorage.removeItem("currentUser");
  },
  isAdmin: (user) => {
    return user?.isAdmin === true;
  },
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.patch("/auth/change-password", { currentPassword, newPassword });
      return response.data; // 성공 메시지 등 리턴
    } catch (err) {
      if (err.response && err.response.data.message) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error("비밀번호 변경 중 오류가 발생했습니다.");
      }
    }
  },
  deleteAccount: async () => {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = storedUser?.token;

  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await axios.delete(`${API_URL}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
},

};


export { authService };
