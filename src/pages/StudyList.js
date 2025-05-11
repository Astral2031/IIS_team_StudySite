// src/pages/StudyList.js
import { useAuth } from "../contexts/AuthContext";

import { Link } from "react-router-dom";
import React from "react";

const StudyList = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center py-5">
      <h1 className="mb-4">스터디 목록</h1>

      <div className="alert alert-info">
        이 페이지는 백엔드 API 개발 후 구현될 예정입니다.
      </div>

      <div className="mt-4">
        {isAuthenticated ? (
          <Link to="#" className="btn btn-primary">
            스터디 만들기
          </Link>
        ) : (
          <Link
            to="/signin"
            className="btn btn-primary"
            state={{ from: "/study/create" }}
          >
            로그인 후 스터디 만들기
          </Link>
        )}
      </div>
    </div>
  );
};

export default StudyList;
