import { postService } from "../services/postsService.js";
import { useAuth } from "../contexts/AuthContext.js";

import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const CreatePost = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isAdmin } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

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

  useEffect(() => {
    if (category === "notice" && !isAdmin) {
      setCategoryError("공지사항은 관리자만 작성할 수 있습니다.");
    } else {
      setCategoryError("");
    }

    if (!isAuthenticated) {
      navigate("/signin", { state: { from: `/community/create/${category}` } });
    }
  }, [category, isAdmin, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        author_id: currentUser.id,
        category,
        isQuestion: category === "qna",
        hasAnswer: false,
      };

      await postService.createPost(postData);
      navigate(`/community/${category}`);
    } catch (error) {
      console.error("게시글 작성 오류:", error);
      alert(error.message || "게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <h2>{getCategoryTitle()} 글 작성</h2>

        {categoryError && (
          <div className="alert alert-danger" role="alert">
            {categoryError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">제목</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={Boolean(categoryError)}  // Boolean 변환
            />
          </div>

          <div className="mb-3">
            <label htmlFor="content" className="form-label">내용</label>
            <textarea
              className="form-control"
              id="content"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={Boolean(categoryError)}  // Boolean 변환
            />
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || Boolean(categoryError)}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">처리 중...</span>
                </>
              ) : (
                "등록"
              )}
            </button>
            <Link to={`/community/${category}`} className="btn btn-secondary ms-2">취소</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
