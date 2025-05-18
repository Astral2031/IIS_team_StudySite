import axios from "axios";

const studyService = {
  saveCustomStudy: async (studyData) => {
    try {
      const response = await axios.post("/api/studies/createStudy", studyData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;  // 저장된 스터디 정보 리턴 (필요하면)
    } catch (error) {
      console.error("스터디 저장 오류:", error);
      throw error;
    }
  },
};

export { studyService };
