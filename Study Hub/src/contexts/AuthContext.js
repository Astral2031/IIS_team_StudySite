// src/contexts/AuthContext.js
import { authService } from "../services/authService.js"
import axios from "axios";

import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 상태 추가

  // 초기 로딩 시 localStorage에서 로그인 정보 확인
  useEffect(() => {
  const user = localStorage.getItem("currentUser");
  if (user && user !== "undefined") {  // 여기서 undefined 문자열 체크 추가
    const userData = JSON.parse(user);
    setCurrentUser(userData);
    setIsAdmin(authService.isAdmin(userData));
  }
  setLoading(false);
}, []);


  // 로그인 함수
  const login = async (userData) => {
  try {
    const newUser = await authService.login(userData.email, userData.password);
    setCurrentUser(newUser);
    setIsAdmin(authService.isAdmin(newUser));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return newUser;
  } catch (error) {
    throw error;
  }
};


  // 로그아웃 함수
  const logout = () => {
    authService.logout(); // 서비스 계층에 로직 위임
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setIsAdmin(false);
  };

  // 회원가입 함수
  const register = async (userData) => {
    try {
      // 백엔드에 POST 요청 (비동기)
      const response = await axios.post("/api/auth/register", userData);
      const newUser = response.data;  // 서버에서 온 사용자 정보

      setCurrentUser(newUser);
      setIsAdmin(false); // 일반 회원가입은 항상 일반 사용자
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      return newUser;
    } catch (error) {
      // 에러 메시지 서버에서 받아서 던지기 or 커스텀 메시지
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser,
    isAdmin, // 관리자 여부 추가
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
