import axios from "axios";

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
    const res = await fetch(`${API}/popular`);
    if (!res.ok) throw new Error("Failed to fetch popular posts");
    return res.json();
  },
  increaseViews: async (category, id) => {
    try {
      const res = await axios.post(`${API}/${category}/${id}/increase-views`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "조회수 증가 실패");
    }
  },
};



