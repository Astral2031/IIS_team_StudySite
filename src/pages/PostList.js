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
  };

  return (
    <div className="row">
      <div className="col-12">
        <CommunityNav category={category} />

        <div className="mb-3">
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="게시글 검색"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: "80%", flexGrow: 1 }}
            />
            <button className="btn btn-outline-primary" type="submit">
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
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
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
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  <li className="page-item">
                    <button className="page-link" disabled>
                      이전
                    </button>
                  </li>
                  <li className="page-item active">
                    <button className="page-link">1</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link" disabled>
                      다음
                    </button>
                  </li>
                </ul>
              </nav>

              {isAuthenticated ? (
                <Link
                  to={`/community/create/${category}`}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "1.1rem" }} // 글자 크기 조정
                >
                  글쓰기
                </Link>
              ) : (
                <Link
                  to="/signin"
                  state={{ from: `/community/create/${category}` }}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "1.1rem" }} // 글자 크기 조정
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
