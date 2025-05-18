// src/pages/PostDetail.js
import { postService } from "../services/postsService.js";
import { useAuth } from "../contexts/AuthContext.js";

import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const PostDetail = () => {
  const { category, id } = useParams();
  const { currentUser, isAuthenticated, isAdmin } = useAuth(); // isAdmin 추가
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [likeStatus, setLikeStatus] = useState(false);

  // 수정/삭제 관련 상태 추가
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  
  

  // 게시글 데이터 가져오기
 const fetchPost = async () => {
  try {
    // id로 게시글 상세 정보 가져오기 (비동기니까 await 필수)
    const fetchedPost = await postService.getPostById(category,id);

    if (fetchedPost) {
      // 조회수 증가 API 호출 (await 필수)
      await postService.increaseViews(category, id);



      // 상태 업데이트
      setPost(fetchedPost);

      // 좋아요 여부 체크
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


  useEffect(() => {
    setLoading(true);
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        authorId: currentUser.id,
        isAnswer: post.isQuestion && !post.hasAnswer, // 질문글이고 답변이 없는 경우 답변으로 설정
      };

      // 댓글 또는 답변 추가
      if (newComment.isAnswer) {
        postService.addAnswer(parseInt(id), newComment);
      } else {
        postService.addComment(parseInt(id), newComment);
      }

      // 게시글 다시 가져오기
      fetchPost();
      setCommentContent("");
    } catch (error) {
      console.error("댓글 작성 중 오류가 발생했습니다:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
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

  // 게시글 수정 모드 진입
  const handleEditPost = () => {
    setIsEditingPost(true);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  // 게시글 수정 취소
  const handleCancelEditPost = () => {
    setIsEditingPost(false);
  };

  // 게시글 수정 저장
  const handleSavePost = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // 게시글 수정 (수정: 현재 사용자 객체 전달)
      const updatedPost = postService.updatePost(parseInt(id), currentUser, {
        title: editTitle,
        content: editContent,
        category: post.category, // 카테고리는 유지
      });

      setPost(updatedPost);
      setIsEditingPost(false);
      alert("게시글이 수정되었습니다.");
    } catch (error) {
      console.error("게시글 수정 중 오류가 발생했습니다:", error);
      alert(error.message || "게시글 수정에 실패했습니다.");
    }
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
  if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
    return;
  }

  try {
    await postService.deletePost(category, parseInt(id));
    alert("게시글이 삭제되었습니다.");

    // 삭제 후 목록 페이지로 이동
    navigate(`/community/${category}`);
  } catch (error) {
    console.error("게시글 삭제 중 오류가 발생했습니다:", error);
    alert(error.message || "게시글 삭제에 실패했습니다.");
  }
};


  // 댓글 수정 모드 진입
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  // 댓글 수정 저장
  const handleSaveComment = (commentId) => {
    if (!editCommentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      // 댓글 수정
      postService.updateComment(
        parseInt(id),
        commentId,
        currentUser.id,
        editCommentContent
      );

      // 게시글 다시 가져오기
      fetchPost();
      setEditingCommentId(null);
      setEditCommentContent("");
      alert("댓글이 수정되었습니다.");
    } catch (error) {
      console.error("댓글 수정 중 오류가 발생했습니다:", error);
      alert(error.message || "댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = (commentId) => {
    if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      // 댓글 삭제
      postService.deleteComment(parseInt(id), commentId, currentUser.id);

      // 게시글 다시 가져오기
      fetchPost();
      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 중 오류가 발생했습니다:", error);
      alert(error.message || "댓글 삭제에 실패했습니다.");
    }
  };

  // 현재 사용자가 게시글 작성자인지 확인하는 함수
  const isPostAuthor = () => {
    if (!isAuthenticated || !currentUser || !post) return false;

    // 작성자 이름으로 확인 또는 관리자인 경우 접근 허용
    return post.author === currentUser.name || isAdmin;
  };

  // 현재 사용자가 댓글 작성자인지 확인하는 함수
  const isCommentAuthor = (comment) => {
    if (!isAuthenticated || !currentUser) return false;

    // 작성자 이름으로 확인 또는 관리자인 경우 접근 허용
    return comment.author === currentUser.name || isAdmin;
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
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Link
            to={`/community/${category}`}
            className="btn btn-outline-secondary"
          >
            목록으로
          </Link>

          {/* 게시글 작성자 또는 관리자인 경우에만 수정/삭제 버튼 표시 */}
          {isPostAuthor() && (
            <div>
              <button
                className="btn btn-outline-primary me-2"
                onClick={handleEditPost}
              >
                수정
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={handleDeletePost}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            {isEditingPost ? (
              <input
                type="text"
                className="form-control"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            ) : (
              <h3>{post.title}</h3>
            )}
            {!isEditingPost && (
              <div>
                <span className="text-muted">
                  {post.author} | {post.createdAt}
                  {post.updatedAt && ` (수정됨: ${post.updatedAt})`}
                </span>
                <span className="ms-2">조회 {post.viewCount}</span>
              </div>
            )}
          </div>
          <div className="card-body">
            {isEditingPost ? (
              <div>
                <textarea
                  className="form-control mb-3"
                  rows="10"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                ></textarea>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={handleCancelEditPost}
                  >
                    취소
                  </button>
                  <button className="btn btn-primary" onClick={handleSavePost}>
                    저장
                  </button>
                </div>
              </div>
            ) : (
              <div className="post-content mb-4 white-space-pre-line">
                {post.content.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            )}

            {!isEditingPost && (
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
            )}
          </div>
        </div>

        {!isEditingPost && (
          <div className="card mb-4">
            <div className="card-header">
              <h4>
                {post.isQuestion && !post.hasAnswer ? "답변 등록" : "댓글"}{" "}
                {post.comments?.length > 0 ? `(${post.comments.length})` : ""}
              </h4>
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
                      <div>
                        <span className="text-muted">
                          {comment.createdAt}
                          {comment.isEdited && " (수정됨)"}
                        </span>

                        {/* 댓글 작성자 또는 관리자인 경우에만 수정/삭제 버튼 표시 */}
                        {isCommentAuthor(comment) &&
                          editingCommentId !== comment.id && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-secondary ms-2"
                                onClick={() => handleEditComment(comment)}
                              >
                                수정
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger ms-1"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                삭제
                              </button>
                            </>
                          )}
                      </div>
                    </div>

                    {editingCommentId === comment.id ? (
                      <div className="mt-2">
                        <textarea
                          className="form-control mb-2"
                          rows="3"
                          value={editCommentContent}
                          onChange={(e) =>
                            setEditCommentContent(e.target.value)
                          }
                        ></textarea>
                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-sm btn-secondary me-2"
                            onClick={handleCancelEditComment}
                          >
                            취소
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSaveComment(comment.id)}
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">{comment.content}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted mb-3">
                  {post.isQuestion
                    ? "아직 답변이 없습니다."
                    : "아직 댓글이 없습니다."}
                </div>
              )}

              {!editingCommentId && (
                <form onSubmit={handleCommentSubmit}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder={
                        isAuthenticated
                          ? post.isQuestion && !post.hasAnswer
                            ? "답변을 작성해주세요"
                            : "댓글을 작성해주세요"
                          : "로그인이 필요합니다"
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
                        {post.isQuestion && !post.hasAnswer
                          ? "답변 등록"
                          : "댓글 등록"}
                      </button>
                    ) : (
                      <Link
                        to="/signin"
                        className="btn btn-primary"
                        state={{ from: `/community/post/${id}` }}
                      >
                        로그인 후 작성
                      </Link>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
