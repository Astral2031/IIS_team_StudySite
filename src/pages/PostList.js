// src/pages/PostList.js
import { postService } from "../services/storageService";
import { useAuth } from "../contexts/AuthContext";
import CommunityNav from "../components/CommunityNav";

import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

const PostList = () => {
  const { category } = useParams();
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // 페이지당 5개 게시글

  // src/pages/PostList.js의 useEffect 부분 수정
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let data;
        if (category === "popular") {
          data = postService.getPopularPosts();
        } else {
          const serverCategory =
            category === "notice"
              ? "notice"
              : category === "freetalk"
              ? "freetalk"
              : "qna";
          data = postService.getPostsByCategory(serverCategory);
        }

        // 최신순으로 강제 정렬 (ID가 큰 순서로 정렬)
        const sortedByIdDesc = [...data].sort((a, b) => b.id - a.id);

        setPosts(sortedByIdDesc);
        setFilteredPosts(sortedByIdDesc);
        setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 이동
      } catch (error) {
        console.error("게시글을 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  // 검색 기능
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTermLower) ||
        post.author.toLowerCase().includes(searchTermLower)
    );

    setFilteredPosts(filtered);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="row">
      <div className="col-12">
        <CommunityNav category={category} />

        <div className="mb-3 d-flex justify-content-center">
          <form
            className="d-flex"
            onSubmit={handleSearch}
            style={{ width: "70%" }}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="게시글 검색"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <button
              className="btn btn-outline-primary"
              type="submit"
              style={{ minWidth: "100px" }}
            >
              검색
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                  <th>조회수</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.length > 0 ? (
                  currentPosts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>
                        <Link to={`/community/post/${post.id}`}>
                          {post.title}
                          {post.comments && post.comments.length > 0 && (
                            <span className="text-muted ms-1">
                              [{post.comments.length}]
                            </span>
                          )}
                          {post.isQuestion && post.hasAnswer && (
                            <span className="badge bg-success ms-1">
                              답변완료
                            </span>
                          )}
                        </Link>
                      </td>
                      <td>{post.author}</td>
                      <td>{post.createdAt}</td>
                      <td>{post.viewCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="d-flex justify-content-between">
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

              {/* 페이지네이션이 없는 경우에도 동일한 레이아웃 유지 */}
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

              {isAuthenticated ? (
                <Link
                  to={`/community/create/${category}`}
                  className="btn btn-primary" // btn-sm 클래스 제거
                  style={{
                    fontSize: "0.875rem", // 글자 크기 설정
                    padding: "0.375rem 0.75rem", // 표준 버튼 패딩
                    lineHeight: "1.5",
                    borderRadius: "0.25rem",
                    height: "38px", // 높이 고정
                    display: "inline-flex", // 내용 중앙 정렬
                    alignItems: "center", // 내용 수직 중앙
                    justifyContent: "center", // 내용 중앙
                  }}
                >
                  글쓰기
                </Link>
              ) : (
                <Link
                  to="/signin"
                  state={{ from: `/community/create/${category}` }}
                  className="btn btn-primary" // btn-sm 클래스 제거
                  style={{
                    fontSize: "0.875rem", // 글자 크기 설정
                    padding: "0.375rem 0.75rem", // 표준 버튼 패딩
                    lineHeight: "1.5",
                    borderRadius: "0.25rem",
                    height: "38px", // 높이 고정
                    display: "inline-flex", // 내용 중앙
                    alignItems: "center", // 내용 중앙
                    justifyContent: "center", // 내용 중앙
                  }}
                >
                  로그인 후 글쓰기
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostList;
