// src/contexts/AuthContext.js
import { authService } from "../services/storageService";

import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 초기 로딩 시 localStorage에서 로그인 정보 확인
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // 로그인 함수
  const login = async (email, password) => {
    const user = authService.login(email, password);

    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    }

    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  };

  // 로그아웃 함수
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  // 회원가입 함수
  const register = async (userData) => {
    try {
      const newUser = authService.register(userData);
      setCurrentUser(newUser);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
