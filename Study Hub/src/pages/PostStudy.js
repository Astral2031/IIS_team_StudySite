import { studyService } from "../services/studyService.js";
import { useAuth } from "../contexts/AuthContext.js";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PostStudy = () => {
  const { isAuthenticated, currentUser } = useAuth();  // currentUser 추가
  const navigate = useNavigate();

  // 초기 상태에 subject, participants, maxParticipants 추가
  const [studyData, setStudyData] = useState({
    title: "",
    subject: "",
    description: "",
    category: "",
    participants: 1,       // 현재 인원
    maxParticipants: 5,    // 최대 인원
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudyData((prev) => ({
      ...prev,
      [name]:
        name === "participants" || name === "maxParticipants"
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/signin", { state: { from: "/post-study" } });
      return;
    }

    // 서버에서 host_id를 못 넣어준다면 여기서 넣기
    const payload = {
      title: studyData.title,
      subject: studyData.subject,  
      description: studyData.description,
      category: studyData.category,
      current_members: studyData.participants,
      max_members: studyData.maxParticipants,
      host_id: currentUser?.id,   // 로그인한 사용자 ID 넣기
    };
console.log("서버에 보내는 payload:", payload);

    try {

      await studyService.saveCustomStudy(payload);
      alert("스터디가 성공적으로 등록되었습니다.");
      navigate("/study-list");
    } catch (error) {
      console.error("스터디 저장 실패:", error);
      alert("스터디 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 스터디 모집 글 작성</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* 스터디 제목 */}
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>
            스터디 제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={studyData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* 주제 */}
        <div style={styles.formGroup}>
          <label htmlFor="subject" style={styles.label}>
            주제
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={studyData.subject}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* 카테고리 */}
        <div style={styles.formGroup}>
          <label htmlFor="category" style={styles.label}>
            카테고리
          </label>
          <select
            id="category"
            name="category"
            value={studyData.category}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">카테고리를 선택하세요</option>
            <option value="IT 개발">IT 개발</option>
            <option value="언어">언어</option>
            <option value="디자인">디자인</option>
            <option value="자격증">자격증</option>
            <option value="자기개발">자기개발</option>
          </select>
        </div>

        {/* 설명 */}
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>
            설명
          </label>
          <textarea
            id="description"
            name="description"
            value={studyData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>

        {/* 인원수 */}
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label htmlFor="participants" style={styles.label}>
              현재 인원
            </label>
            <input
              type="number"
              id="participants"
              name="participants"
              value={studyData.participants}
              onChange={handleChange}
              min="1"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="maxParticipants" style={styles.label}>
              최대 인원
            </label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={studyData.maxParticipants}
              onChange={handleChange}
              min={studyData.participants}
              required
              style={styles.input}
            />
          </div>
        </div>

        <button type="submit" style={styles.submitButton}>
          스터디 등록하기
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "40px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  formRow: {
    display: "flex",
    gap: "20px",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    minHeight: "150px",
    resize: "vertical",
  },
  submitButton: {
    padding: "12px",
    backgroundColor: "#76d7c4",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px",
  },
};

export default PostStudy;
