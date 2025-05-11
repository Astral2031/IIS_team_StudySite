// src/pages/PostDetail.js
import { postService } from "../services/storageService";
import { useAuth } from "../contexts/AuthContext";

import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const PostDetail = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [likeStatus, setLikeStatus] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const fetchedPost = postService.getPostById(parseInt(id));

        if (fetchedPost) {
          // 조회수 증가
          postService.increaseViewCount(parseInt(id));

          setPost(fetchedPost);

          // 좋아요 상태 확인
          if (currentUser && fetchedPost.likedBy) {
            setLikeStatus(fetchedPost.likedBy.includes(currentUser.id));
          }
        }
      } catch (error) {
        console.error("게시글을 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, currentUser]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    // 로그인 체크
    if (!isAuthenticated) {
      const confirmLogin = window.confirm(
        "댓글을 작성하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      );
      if (confirmLogin) {
        navigate("/signin", { state: { from: `/community/post/${id}` } });
      }
      return;
    }

    if (!commentContent.trim()) return;

    try {
      const newComment = {
        content: commentContent,
        author: currentUser.name,
        isAnswer: false,
      };

      postService.addComment(parseInt(id), newComment);

      // 게시글 다시 가져오기
      const updatedPost = postService.getPostById(parseInt(id));
      setPost(updatedPost);
      setCommentContent("");
    } catch (error) {
      console.error("댓글 작성 중 오류가 발생했습니다:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();

    // 로그인 체크
    if (!isAuthenticated) {
      const confirmLogin = window.confirm(
        "답변을 작성하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      );
      if (confirmLogin) {
        navigate("/signin", { state: { from: `/community/post/${id}` } });
      }
      return;
    }

    if (!answerContent.trim()) return;

    try {
      const newAnswer = {
        content: answerContent,
        author: currentUser.name,
      };

      postService.addAnswer(parseInt(id), newAnswer);

      // 게시글 다시 가져오기
      const updatedPost = postService.getPostById(parseInt(id));
      setPost(updatedPost);
      setAnswerContent("");
    } catch (error) {
      console.error("답변 작성 중 오류가 발생했습니다:", error);
      alert("답변 작성 중 오류가 발생했습니다.");
    }
  };

  const handleLike = () => {
    // 로그인 체크
    if (!isAuthenticated) {
      const confirmLogin = window.confirm(
        "게시글을 추천하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      );
      if (confirmLogin) {
        navigate("/signin", { state: { from: `/community/post/${id}` } });
      }
      return;
    }

    try {
      // 좋아요 토글
      const updatedPost = postService.likePost(parseInt(id), currentUser.id);

      if (updatedPost) {
        setPost(updatedPost);
        setLikeStatus(updatedPost.likedBy.includes(currentUser.id));
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류가 발생했습니다:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="alert alert-danger" role="alert">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="mb-3">
          <Link
            to={`/community/${
              post.category === "notice"
                ? "notice"
                : post.category === "freetalk"
                ? "freetalk"
                : "qna"
            }`}
            className="btn btn-outline-secondary"
          >
            목록으로
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            <h3>{post.title}</h3>
            <div>
              <span className="text-muted">
                {post.author} | {post.createdAt}
              </span>
              <span className="ms-2">조회 {post.viewCount}</span>
            </div>
          </div>
          <div className="card-body">
            <div className="post-content mb-4 white-space-pre-line">
              {post.content.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>

            <div className="d-flex justify-content-end">
              <button
                className={`btn ${
                  likeStatus ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={handleLike}
              >
                ♥ 추천 {post.likeCount}
              </button>
            </div>
          </div>
        </div>

        {post.isQuestion && !post.hasAnswer && (
          <div className="card mb-4">
            <div className="card-header">
              <h4>답변 등록</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleAnswerSubmit}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder={
                      isAuthenticated
                        ? "답변을 작성해주세요"
                        : "답변을 작성하려면 로그인이 필요합니다"
                    }
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    disabled={!isAuthenticated}
                    required
                  />
                </div>
                <div className="text-end">
                  {isAuthenticated ? (
                    <button type="submit" className="btn btn-primary">
                      답변 등록
                    </button>
                  ) : (
                    <Link
                      to="/signin"
                      className="btn btn-primary"
                      state={{ from: `/community/post/${id}` }}
                    >
                      로그인 후 답변 작성
                    </Link>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header">
            <h4>댓글 {post.comments?.length || 0}</h4>
          </div>
          <div className="card-body">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`comment mb-3 ${
                    comment.isAnswer ? "bg-light p-3" : ""
                  }`}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{comment.author}</strong>
                      {comment.isAnswer && (
                        <span className="badge bg-success ms-2">답변</span>
                      )}
                    </div>
                    <span className="text-muted">{comment.createdAt}</span>
                  </div>
                  <div className="mt-2">{comment.content}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted mb-3">
                아직 댓글이 없습니다.
              </div>
            )}

            <form onSubmit={handleCommentSubmit}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder={
                    isAuthenticated
                      ? "댓글을 작성해주세요"
                      : "댓글을 작성하려면 로그인이 필요합니다"
                  }
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  disabled={!isAuthenticated}
                  required
                />
              </div>
              <div className="text-end">
                {isAuthenticated ? (
                  <button type="submit" className="btn btn-primary">
                    댓글 등록
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    className="btn btn-primary"
                    state={{ from: `/community/post/${id}` }}
                  >
                    로그인 후 댓글 작성
                  </Link>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
