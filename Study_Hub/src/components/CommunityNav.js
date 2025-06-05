// src/components/CommunityNav.js 변경사항
import { NavLink } from "react-router-dom";
import React from "react";

const CommunityNav = ({ category }) => {
  return (
    <>
      <div className="community-nav mb-4">
        <ul className="nav nav-pills justify-content-center">
          <li className="nav-item mx-2">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="/community/notice"
            >
              공지사항
            </NavLink>
          </li>
          <li className="nav-item mx-2">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="/community/freetalk"
            >
              자유게시판
            </NavLink>
          </li>
          <li className="nav-item mx-2">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="/community/popular"
            >
              인기글
            </NavLink>
          </li>
          <li className="nav-item mx-2">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="/community/qna"
            >
              Q&A
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="text-center mb-4">
        <h3>
          {category === "notice" && "공지사항"}
          {category === "freetalk" && "자유게시판"}
          {category === "popular" && "인기글"}
          {category === "qna" && "Q&A"}
        </h3>
      </div>
    </>
  );
};

export default CommunityNav;
