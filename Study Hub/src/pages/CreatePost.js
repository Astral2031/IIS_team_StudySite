// src/pages/CreatePost.js
import { postService } from "../services/storageService";
import { useAuth } from "../contexts/AuthContext";

import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const CreatePost = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isAdmin } = useAuth(); // isAdmin 추가

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(""); // 카테고리 에러 메시지

  // 카테고리 한글화
  const getCategoryTitle = () => {
    switch (category) {
      case "notice":
        return "공지사항";
      case "freetalk":
        return "자유게시판";
      case "qna":
        return "Q&A";
      default:
        return "";
    }
  };

  // 관리자 권한 체크 - 공지사항 작성 제한
  useEffect(() => {
    // 공지사항 카테고리인데 관리자가 아니면 오류 표시
    if (category === "notice" && !isAdmin) {
      setCategoryError("공지사항은 관리자만 작성할 수 있습니다.");
    } else {
      setCategoryError("");
    }

    // 로그인 체크
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: `/community/create/${category}` } });
    }
  }, [category, isAdmin, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 공지사항 권한 체크
    if (category === "notice" && !isAdmin) {
      alert("공지사항은 관리자만 작성할 수 있습니다.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title,
        content,
        author: currentUser.name,
        category: category,
        isQuestion: category === "qna",
        hasAnswer: false,
      };

      // 현재 사용자 정보 함께 전달
      postService.createPost(postData, currentUser);
      navigate(`/community/${category}`);
    } catch (error) {
      console.error("게시글 작성 중 오류가 발생했습니다:", error);
      alert(error.message || "게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <h2>{getCategoryTitle()} 글 작성</h2>

        {/* 공지사항 관리자 권한 경고 */}
        {categoryError && (
          <div className="alert alert-danger" role="alert">
            {categoryError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              제목
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={categoryError} // 권한 없으면 입력 비활성화
            />
          </div>

          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              내용
            </label>
            <textarea
              className="form-control"
              id="content"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={categoryError} // 권한 없으면 입력 비활성화
            />
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || categoryError} // 권한 없으면 버튼 비활성화
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span className="ms-2">처리 중...</span>
                </>
              ) : (
                "등록"
              )}
            </button>
            <Link
              to={`/community/${category}`}
              className="btn btn-secondary ms-2"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
