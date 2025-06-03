import apiClient from "./apiClient.js";

const API = "/auth";
const EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2시간 (ms)

const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post(`${API}/login`, { email, password });
      const userInfo = response.data;

      const expiresAt = Date.now() + EXPIRATION_TIME;

      localStorage.setItem("currentUser", JSON.stringify({
        user: userInfo,
        expiresAt,
      }));

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

  getCurrentUser: () => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      if (Date.now() > parsed.expiresAt) {
        // 만료 처리
        localStorage.removeItem("currentUser");
        return null;
      }
      return parsed.user;
    } catch (e) {
      console.error("유저 정보 파싱 실패:", e);
      localStorage.removeItem("currentUser");
      return null;
    }
  },

  isAdmin: (user) => {
    return user?.isAdmin === true;
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.patch(`${API}/change-password`, { currentPassword, newPassword });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.");
    }
  },

  deleteAccount: async () => {
    try {
      const response = await apiClient.delete(`${API}/delete`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "회원 탈퇴 중 오류가 발생했습니다.");
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get(`${API}/profile`);
      return response.data;
    } catch (error) {
      console.error("내 정보 불러오기 오류:", error);
      return {};
    }
  },
};

export { authService };
