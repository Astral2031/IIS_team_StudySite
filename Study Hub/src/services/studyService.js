import axios from "axios";

const studyService = {
  saveCustomStudy: async (studyData) => {
    try {
      const response = await axios.post("/api/studies", studyData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("스터디 저장 오류:", error);
      throw error;
    }
  },

  getFilteredStudies: async (category) => {
    try {
      const params = category && category !== "전체" ? { category } : {};
      const response = await axios.get("/api/studies", { params });
      return response.data;
    } catch (error) {
      console.error("스터디 조회 오류:", error);
      throw error;
    }
  },

  deleteCustomStudy: async (id) => {
    try {
      const response = await axios.delete(`/api/studies/${id}`);
      return response.data;
    } catch (error) {
      console.error("스터디 삭제 오류:", error);
      throw error;
    }
  },
};


export { studyService };
