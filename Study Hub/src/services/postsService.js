import axios from "axios";
import apiClient from './apiClient.js';

const API = "http://localhost:5000/api/posts";

export const postService = {
  createPost: async (postData) => {
    try {
      const res = await axios.post(`${API}/create/${postData.category}`, {
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
      const res = await axios.get(`${API}/${category}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "게시글 불러오기 실패");
    }
  },
  getPostById: async (category, id) => {
    return axios.get(`${API}/${category}/${id}`).then(res => res.data);
  },
  getPopularPosts: async () => {
  try {
    const res = await axios.get(`${API}/popular`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "인기 게시글 불러오기 실패");
  }
},

  increaseViews: async (category, id) => {
    try {
      const res = await axios.post(`${API}/${category}/${id}/increase-views`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "조회수 증가 실패");
    }
  },
  deletePost: async (category, id) => {
    try {
      const res = await axios.delete(`${API}/${category}/${id}`);
      return res.data; // { message: "게시물이 삭제되었습니다." }
    } catch (err) {
      throw new Error(err.response?.data?.error || "게시글 삭제 실패");
    }
  },
  updatePost: async (category, id, updatedData) => {
    return await axios.put(`/api/posts/${category}/${id}`, updatedData);
  },
  likePost: async (category, postId) => {
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  if (!currentUser || !currentUser.token) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const response = await axios.post(
      `${API}/${category}/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("좋아요 에러:", err);
    console.log("전송할 토큰:", currentUser.token);
    throw new Error(err.response?.data?.message || "좋아요 요청 실패");
  }
},
addComment: async (category, postId, commentData) => {
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  if (!currentUser || !currentUser.token) {
    throw new Error("로그인이 필요합니다.");
  }

  const token = currentUser.token;

  const response = await axios.post(
    `${API}/${category}/${postId}/comments`,
    { content: commentData.content },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
},


getComments: async (category, postId) => {
  try {
    const res = await axios.get(`${API}/${category}/${postId}/comments`);
    return res.data; // [{ id, author_id, content, created_at, ... }, ...]
  } catch (err) {
    throw new Error(err.response?.data?.error || "댓글 불러오기 실패");
  }
},
updateComment: (category, postId, commentId, content) => {
  console.log('updateComment 호출:', { category, postId, commentId, content });
  if (!content || content.trim() === '') {
    console.error('content가 비어있음');
  }
  return apiClient.put(`/posts/${category}/${postId}/comments/${commentId}`, { content }).then(res => res.data);
},
deleteComment: async (category, postId, commentId) => {
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  if (!currentUser || !currentUser.token) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const res = await axios.delete(
      `${API}/${category}/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "댓글 삭제 실패");
  }
},

};



