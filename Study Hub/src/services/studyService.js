import apiClient from "./apiClient.js";

const studyService = {
  saveCustomStudy: async (studyData) => {
    try {
      const response = await apiClient.post("/studies", studyData);
      return response.data;
    } catch (error) {
      console.error("스터디 저장 오류:", error);
      throw error;
    }
  },

  getFilteredStudies: async (category) => {
    try {
      const params = category && category !== "전체" ? { category } : {};
      const response = await apiClient.get("/studies", { params });
      return response.data;
    } catch (error) {
      console.error("스터디 조회 오류:", error);
      throw error;
    }
  },

  deleteCustomStudy: async (id) => {
    try {
      const response = await apiClient.delete(`/studies/${id}`);
      return response.data;
    } catch (error) {
      console.error("스터디 삭제 오류:", error);
      throw error;
    }
  },
  applyToStudy: async (studyId, applicationData) => {
    const response = await apiClient.post(`/studies/${studyId}/apply`, applicationData);
    return response.data;
  },
  getStudyById: async (id) => {
  try {
    const response = await apiClient.get(`/studies/${id}`);
    return response.data;
  } catch (error) {
    console.error("스터디 상세 조회 오류:", error);
    throw error;
  }
},
};

export { studyService };
