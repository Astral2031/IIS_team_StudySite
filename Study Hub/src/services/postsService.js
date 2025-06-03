import apiClient from "./apiClient.js";

const API = "/posts";

export const postService = {
  createPost: async (postData) => {
    try {
      const res = await apiClient.post(`${API}/create/${postData.category}`, {
        title: postData.title,
        content: postData.content,
        author_id: postData.author_id,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "게시글 작성 실패");
    }
  },

  getPosts: async (category) => {
    try {
      const res = await apiClient.get(`${API}/${category}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "게시글 불러오기 실패");
    }
  },

  getPostById: async (category, id) => {
    const res = await apiClient.get(`${API}/${category}/${id}`);
    return res.data;
  },

  getPopularPosts: async () => {
    try {
      const res = await apiClient.get(`${API}/popular`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "인기 게시글 불러오기 실패");
    }
  },

  increaseViews: async (category, id) => {
    try {
      const res = await apiClient.post(`${API}/${category}/${id}/increase-views`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "조회수 증가 실패");
    }
  },

  deletePost: async (category, id) => {
    try {
      const res = await apiClient.delete(`${API}/${category}/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "게시글 삭제 실패");
    }
  },

  updatePost: async (category, id, updatedData) => {
    try {
      const res = await apiClient.put(`${API}/${category}/${id}`, updatedData);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "게시글 수정 실패");
    }
  },

  likePost: async (category, postId) => {
    try {
      const res = await apiClient.post(`${API}/${category}/${postId}/like`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "좋아요 요청 실패");
    }
  },

  addComment: async (category, postId, commentData) => {
    try {
      const res = await apiClient.post(`${API}/${category}/${postId}/comments`, {
        content: commentData.content,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "댓글 작성 실패");
    }
  },

  getComments: async (category, postId) => {
    try {
      const res = await apiClient.get(`${API}/${category}/${postId}/comments`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "댓글 불러오기 실패");
    }
  },

  updateComment: async (category, postId, commentId, content) => {
    if (!content || content.trim() === "") {
      throw new Error("댓글 내용이 비어있습니다.");
    }
    try {
      const res = await apiClient.put(
        `${API}/${category}/${postId}/comments/${commentId}`,
        { content }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "댓글 수정 실패");
    }
  },

  deleteComment: async (category, postId, commentId) => {
    try {
      const res = await apiClient.delete(
        `${API}/${category}/${postId}/comments/${commentId}`
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "댓글 삭제 실패");
    }
  },
};
