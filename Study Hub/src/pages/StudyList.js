// src/pages/StudyList.js
import { studyService } from "../services/storageService";
import { useAuth } from "../contexts/AuthContext";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const StudyList = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const studiesPerPage = 5;
  const [filteredStudies, setFilteredStudies] = useState([]);

  useEffect(() => {
    // studyService를 사용하여 데이터 로드
    const studiesData = studyService.getFilteredStudies(selectedCategory);

    // 최신순으로 정렬 (createdAt 기준)
    const sortedStudies = [...studiesData].sort((a, b) => {
      // createdAt이 없는 경우를 대비해 기본값 설정
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA; // 내림차순 정렬 (최신순)
    });

    setFilteredStudies(sortedStudies);
  }, [selectedCategory]);

  const handleDelete = (id, e) => {
    e.preventDefault(); // 이벤트 전파 방지
    e.stopPropagation(); // 클릭 이벤트가 상위로 전파되는 것을 방지

    if (window.confirm("정말로 이 스터디를 삭제하시겠습니까?")) {
      studyService.deleteCustomStudy(id);
      // 삭제 후 리스트 다시 로드
      const updatedStudies = studyService.getFilteredStudies(selectedCategory);

      // 최신순으로 정렬
      const sortedStudies = [...updatedStudies].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });

      setFilteredStudies(sortedStudies);

      const totalPagesAfterDelete = Math.ceil(
        updatedStudies.length / studiesPerPage
      );
      if (currentPage > totalPagesAfterDelete) {
        setCurrentPage(1);
      }
    }
  };

  // 페이지네이션 계산
  const indexOfLastStudy = currentPage * studiesPerPage;
  const indexOfFirstStudy = indexOfLastStudy - studiesPerPage;
  const currentStudies = filteredStudies.slice(
    indexOfFirstStudy,
    indexOfLastStudy
  );
  const totalPages = Math.ceil(filteredStudies.length / studiesPerPage);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="text-center mb-4">
            <h2>전체 스터디 리스트</h2>
          </div>

          {/* 카테고리 탭 형태로 변경 */}
          <ul className="nav nav-pills justify-content-center mb-4">
            {categories.map((category) => (
              <li className="nav-item" key={category}>
                <button
                  className={`nav-link ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>

          {/* 테이블 형태의 스터디 목록 */}
          {currentStudies.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>주제</th>
                  <th>인원</th>
                  <th>카테고리</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {currentStudies.map((study) => (
                  <tr key={study.id}>
                    <td>
                      <Link
                        to={`/study-apply/${study.id}`}
                        className="text-decoration-none"
                      >
                        {study.title}
                      </Link>
                    </td>
                    <td>{study.subject}</td>
                    <td>
                      {study.participants || study.memberCount}/
                      {study.maxParticipants || study.maxMembers}
                    </td>
                    <td>{study.category}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/study-apply/${study.id}`}
                          state={{ canApply: true }}
                          className="btn btn-sm btn-primary"
                        >
                          신청하기
                        </Link>
                        {study.category === "직접 작성" && (
                          <button
                            onClick={(e) => handleDelete(study.id, e)}
                            className="btn btn-sm btn-danger"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info text-center">
              스터디가 없습니다.
            </div>
          )}

          {/* 하단 버튼 영역 */}
          <div className="d-flex justify-content-between align-items-center">
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  {/* 이전 버튼 */}
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      이전
                    </button>
                  </li>

                  {/* 페이지 번호 */}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i + 1}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  {/* 다음 버튼 */}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </button>
                  </li>
                </ul>
              </nav>
            )}

            {/* 페이지네이션이 없는 경우에도 공간 유지 */}
            {totalPages <= 1 && (
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  <li className="page-item disabled">
                    <button className="page-link" disabled>
                      이전
                    </button>
                  </li>
                  <li className="page-item active">
                    <button className="page-link">1</button>
                  </li>
                  <li className="page-item disabled">
                    <button className="page-link" disabled>
                      다음
                    </button>
                  </li>
                </ul>
              </nav>
            )}

            {/* 글쓰기 버튼 */}
            {isAuthenticated ? (
              <Link
                to="/post-study"
                className="btn btn-primary"
                style={{
                  fontSize: "0.875rem",
                  padding: "0.375rem 0.75rem",
                  lineHeight: "1.5",
                  borderRadius: "0.25rem",
                  height: "38px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                글쓰기
              </Link>
            ) : (
              <Link
                to="/signin"
                state={{ from: "/post-study" }}
                className="btn btn-primary"
                style={{
                  fontSize: "0.875rem",
                  padding: "0.375rem 0.75rem",
                  lineHeight: "1.5",
                  borderRadius: "0.25rem",
                  height: "38px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                로그인 후 글쓰기
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const categories = [
  "전체",
  "IT 개발",
  "언어",
  "디자인",
  "자격증",
  "자기개발",
  "직접 작성",
];

export default StudyList;
