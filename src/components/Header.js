// src/components/Header.js
import { useAuth } from "../contexts/AuthContext";

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      <div className="container">
        {/* 사이트 제목 */}
        <div className="text-center py-3">
          <h1 className="site-title">
            <Link to="/" className="text-decoration-none text-dark">
              Study Hub
            </Link>
          </h1>

          {/* 검색창 */}
          <div className="row justify-content-center my-3">
            <div className="col-md-6">
              <form className="d-flex" onSubmit={handleSearch}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="검색어를 입력하세요"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ maxWidth: "80%", flexGrow: 1 }}
                />
                <button type="submit" className="btn btn-outline-primary">
                  검색
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 메인 메뉴 (List, Community) */}
        <div className="main-menu py-2 border-top border-bottom">
          <ul className="nav justify-content-center">
            <li className="nav-item px-4">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link fw-bold active" : "nav-link"
                }
                to="/list"
              >
                List
              </NavLink>
            </li>
            <li className="nav-item px-4">
              <NavLink
                className={({ isActive }) =>
                  location.pathname.includes("/community")
                    ? "nav-link fw-bold active"
                    : "nav-link"
                }
                to="/community/notice"
              >
                Community
              </NavLink>
            </li>
          </ul>
        </div>

        {/* 로그인/가입 메뉴는 우측 상단에 배치 */}
        <div className="position-absolute top-0 end-0 p-3">
          {isAuthenticated ? (
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                type="button"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {currentUser.name}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userMenu"
              >
                <li>
                  <Link className="dropdown-item" to="/mypage">
                    마이페이지
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/mypage/studies">
                    내 스터디
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    로그아웃
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link
                to="/signin"
                className="btn btn-sm btn-outline-secondary me-2"
              >
                로그인
              </Link>
              <Link to="/signup" className="btn btn-sm btn-outline-primary">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
