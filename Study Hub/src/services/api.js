// src/services/api.js
import axios from "axios";

// 백엔드 API 주소 (개발 환경)
const API_URL = "http://localhost:5000/api";

// API 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 게시글 관련 API
export const postService = {
  // 모든 게시글 가져오기
  getAllPosts: async () => {
    try {
      const response = await apiClient.get("/posts");
      return response.data;
    } catch (error) {
      console.error("게시글을 불러오는 중 오류가 발생했습니다:", error);
      return [];
    }
  },

  // 카테고리별 게시글 가져오기
  getPostsByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/posts/category/${category}`);
      return response.data;
    } catch (error) {
      console.error("게시글을 불러오는 중 오류가 발생했습니다:", error);
      return [];
    }
  },

  // 특정 게시글 상세 정보 가져오기
  getPostById: async (id) => {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error("게시글을 불러오는 중 오류가 발생했습니다:", error);
      return null;
    }
  },

  // 새 게시글 생성
  createPost: async (postData) => {
    try {
      const response = await apiClient.post("/posts", postData);
      return response.data;
    } catch (error) {
      console.error("게시글 작성 중 오류가 발생했습니다:", error);
      throw error;
    }
  },
};

// 댓글 관련 API
export const commentService = {
  // 댓글 추가
  addComment: async (commentData) => {
    try {
      const response = await apiClient.post("/comments", commentData);
      return response.data;
    } catch (error) {
      console.error("댓글 작성 중 오류가 발생했습니다:", error);
      throw error;
    }
  },

  // 답변 추가
  addAnswer: async (commentData) => {
    try {
      const response = await apiClient.post("/comments/answer", commentData);
      return response.data;
    } catch (error) {
      console.error("답변 작성 중 오류가 발생했습니다:", error);
      throw error;
    }
  },
};
