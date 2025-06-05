import apiClient from "./apiClient.js";

export const searchService = {
  async search(query) {
    try {
      const response = await apiClient.get("/search", {
        params: { q: query },
      });
      return response.data; // { posts: [...], studies: [...] } 형태 기대
    } catch (error) {
      console.error("검색 서비스 오류:", error);
      throw error;
    }
  },
};
