import apiClient from "./apiClient.js";

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
};

export { authService };
