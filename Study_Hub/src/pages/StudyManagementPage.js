import { useEffect, useState } from "react";
import apiClient from "../services/apiClient.js";

function StudyManagementPage() {
  const [hostedStudies, setHostedStudies] = useState([]);
  const [applicantsByStudy, setApplicantsByStudy] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get("/studies/hosted");
        const studies = res.data;
        setHostedStudies(studies);

        const applicantsData = {};
        await Promise.all(
          studies.map(async (study) => {
            const res = await apiClient.get(`/studies/${study.id}/applicants`);
            applicantsData[study.id] = res.data;
          })
        );
        setApplicantsByStudy(applicantsData);
      } catch (err) {
        alert("데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (studyId, userId, status) => {
    try {
      await apiClient.patch(`/studies/${studyId}/status`, { userId, status });
      const res = await apiClient.get(`/studies/${studyId}/applicants`);
      setApplicantsByStudy((prev) => ({ ...prev, [studyId]: res.data }));
      alert(`${status === "accepted" ? "수락" : "거절"} 처리 완료`);
    } catch (err) {
      alert("처리 실패: " + (err.response?.data?.message || ""));
    }
  };

  if (loading) return <p>로딩중...</p>;

  const studiesWithApplicants = hostedStudies.filter(
    (study) => applicantsByStudy[study.id]?.length > 0
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>스터디 신청자 관리</h2>
      {hostedStudies.length === 0 ? (
        <p style={styles.noApplicants}>운영 중인 스터디가 없습니다.</p>
      ) : studiesWithApplicants.length === 0 ? (
        <p style={styles.noApplicants}>현재 신청자가 있는 스터디가 없습니다.</p>
      ) : (
        studiesWithApplicants.map((study) => (
          <div key={study.id} style={{ marginBottom: "40px" }}>
            <h3 style={styles.name}>{study.title}</h3>
            <ul style={styles.list}>
              {applicantsByStudy[study.id].map((applicant) => (
                <li key={applicant.id} style={styles.listItem}>
                  <div style={styles.info}>
                    <p><strong>신청자:</strong> {applicant.name}</p>
                    <p><strong>신청일:</strong> {new Date(applicant.applied_at).toLocaleDateString()}</p>
                    <p><strong>자기소개:</strong> {applicant.message}</p>
                  </div>
                  <div style={styles.buttonGroup}>
                    <button
                      style={styles.acceptButton}
                      onClick={() => handleStatusUpdate(study.id, applicant.user_id, "accepted")}
                    >
                      수락
                    </button>
                    <button
                      style={styles.rejectButton}
                      onClick={() => handleStatusUpdate(study.id, applicant.user_id, "rejected")}
                    >
                      거절
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  title: {
    fontSize: "26px",
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    marginBottom: "30px",
    color: "#777",
  },
  noApplicants: {
    color: "#999",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #eee",
    borderRadius: "12px",
    backgroundColor: "#fafafa",
    textAlign: "left",
  },
  info: {
    marginBottom: "16px",
  },
  name: {
    margin: "0 0 10px",
    fontSize: "20px",
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  acceptButton: {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  rejectButton: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default StudyManagementPage;
