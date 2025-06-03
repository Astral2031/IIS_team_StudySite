import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../services/apiClient.js"


function StudyManagementPage() {
    const { studyId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);


    const [hostedStudyId, setHostedStudyId] = useState(null);

useEffect(() => {
  const fetchHostedStudyId = async () => {
    try {
      const res = await apiClient.get('/studies/hosted');
      // Axios는 응답 데이터가 res.data에 있음
      if (res.data.length > 0) {
        setHostedStudyId(res.data[0].id);
      }
    } catch (error) {
      console.error("호스트 스터디 조회 실패:", error);
    }
  };

  fetchHostedStudyId();
}, []);





    // 1) 신청자 목록 불러오기
    const fetchApplicants = async () => {
        if (!studyId) return;  // studyId 없으면 요청 안함

        try {
            const res = await apiClient.get(`/studies/${studyId}/applicants`);
            setApplicants(res.data);
        } catch (err) {
            alert(err.response?.data?.message || "신청자 목록 불러오기 실패");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchApplicants();
    }, [studyId]);

    // 2) 수락 API 호출 함수
    const handleAccept = async (id) => {
        try {
            await apiClient.patch(`/study-applications/${id}/status`, { status: "accepted" });
            alert("수락 처리 완료");
            setApplicants(applicants.filter((a) => a.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "수락 처리 실패");
        }
    };

    // 3) 거절 API 호출 함수
    const handleReject = async (id) => {
        try {
            await apiClient.patch(`/study-applications/${id}/status`, { status: "rejected" });
            alert("거절 처리 완료");
            setApplicants(applicants.filter((a) => a.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "거절 처리 실패");
        }
    };

    if (loading) return <p>로딩중...</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>스터디 신청자 관리</h2>
            <p style={styles.subtitle}>코딩 스터디에 신청한 인원 목록입니다.</p>

            {applicants.length === 0 ? (
                <p style={styles.noApplicants}>신청자가 없습니다.</p>
            ) : (
                <ul style={styles.list}>
                    {applicants.map((applicant) => (
                        <li key={applicant.id} style={styles.listItem}>
                            <div style={styles.info}>
                                <h3 style={styles.name}>{applicant.name}</h3>
                                <p>
                                    <strong>신청일:</strong>{" "}
                                    {new Date(applicant.applied_at).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>자기소개:</strong> {applicant.message}
                                </p>
                            </div>
                            <div style={styles.buttonGroup}>
                                <button
                                    onClick={() => handleAccept(applicant.id)}
                                    style={styles.acceptButton}
                                >
                                    수락
                                </button>
                                <button
                                    onClick={() => handleReject(applicant.id)}
                                    style={styles.rejectButton}
                                >
                                    거절
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
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
