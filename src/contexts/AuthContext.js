// src/contexts/AuthContext.js
import { authService } from "../services/storageService";

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
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      setIsAdmin(authService.isAdmin(userData)); // 관리자 여부 확인
    }
    setLoading(false);
  }, []);

  // 로그인 함수
  const login = async (email, password) => {
    const user = authService.login(email, password);

    if (user) {
      setCurrentUser(user);
      setIsAdmin(authService.isAdmin(user)); // 관리자 여부 확인
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    }

    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  };

  // 로그아웃 함수
  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false); // 관리자 상태 초기화
    localStorage.removeItem("currentUser");
  };

  // 회원가입 함수
  const register = async (userData) => {
    try {
      const newUser = authService.register(userData);
      setCurrentUser(newUser);
      setIsAdmin(false); // 일반 회원가입은 항상 일반 사용자
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      throw error;
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
