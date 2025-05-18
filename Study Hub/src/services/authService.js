import axios from "axios";

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const userInfo = response.data; // 비밀번호 제외된 사용자 정보
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
    return user?.email === "admin@example.com";  // 예시: 이메일 기준 관리자 판별
  },
};

export { authService };
