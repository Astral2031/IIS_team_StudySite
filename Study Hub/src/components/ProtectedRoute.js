// src/components/ProtectedRoute.js
import { useAuth } from "../contexts/AuthContext.js";

import { Navigate, useLocation } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
