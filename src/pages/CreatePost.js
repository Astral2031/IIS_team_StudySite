// src/pages/CreatePost.js
import { postService } from "../services/storageService";
import { useAuth } from "../contexts/AuthContext";

import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";

const CreatePost = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      postService.createPost(postData);
      navigate(`/community/${category}`);
    } catch (error) {
      console.error("게시글 작성 중 오류가 발생했습니다:", error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <h2>{getCategoryTitle()} 글 작성</h2>

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
            />
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
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
