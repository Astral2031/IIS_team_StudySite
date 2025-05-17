import { useAuth } from "../contexts/AuthContext";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();
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

        {/* 메인 메뉴 */}
        <div className="main-menu py-2 border-top border-bottom">
          <ul className="nav justify-content-center">
            <li className="nav-item px-4">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link fw-bold active" : "nav-link"
                }
                to="/study-list"
              >
                List
              </NavLink>
            </li>

            {/* MY STUDY 메뉴 - 로그인된 경우에만 표시 */}
            {isAuthenticated && (
              <li className="nav-item px-4">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link fw-bold active" : "nav-link"
                  }
                  to="/my-studies"
                >
                  My Study
                </NavLink>
              </li>
            )}

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
                {currentUser?.name}
                {isAdmin && (
                  <span className="badge bg-danger ms-1">관리자</span>
                )}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userMenu"
              >
                <li>
                  <Link className="dropdown-item" to="/profile-settings">
                    계정설정
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/my-community">
                    커뮤니티 활동
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/study-applicants">
                    스터디 신청자 관리
                  </Link>
                </li>
                {isAdmin && (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/community/create/notice"
                      >
                        공지사항 작성
                      </Link>
                    </li>
                  </>
                )}
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
