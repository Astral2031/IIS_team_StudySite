import { studyService } from "../services/studyService.js";
import { useAuth } from "../contexts/AuthContext.js";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const StudyApply = () => {
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const canApply = location.state?.canApply ?? false;

  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState({
    name: "",
    availableTime: "",
    reason: "",
  });

  useEffect(() => {
  const fetchStudy = async () => {
    try {
      const foundStudy = await studyService.getStudyById(id);
      setStudy(foundStudy);

      if (currentUser) {
        setApplicationData((prev) => ({
          ...prev,
          name: currentUser.nickname || "",
        }));
      }
    } catch (error) {
      console.error("스터디 상세 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchStudy();
}, [id, currentUser]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await studyService.applyToStudy(id, {
      userId: currentUser.id,
      name: applicationData.name, 
      available_time: applicationData.availableTime,
      reason: applicationData.reason,
    });

    alert("스터디 신청이 완료되었습니다!");
    navigate("/study-list");
  } catch (error) {
    console.error("스터디 신청 실패:", error);
    alert("신청에 실패했습니다. 다시 시도해주세요.");
  }
};


  if (loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="container py-4 text-center">
        <div className="alert alert-danger">스터디를 찾을 수 없습니다.</div>
        <button
          onClick={() => navigate("/study-list")}
          className="btn btn-primary"
        >
          목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">스터디 상세 보기 {canApply && " & 신청하기"}</h2>

      <div className="mb-4 p-3 bg-light rounded">
        <h3>{study.title}</h3>
        <p>주제: {study.subject}</p>
        <p>카테고리: {study.category}</p>
        <p>
          인원: {study.current_members}/{study.max_members}
        </p>
        {study.description && <p>{study.description}</p>}
      </div>

      {/* 신청 폼 */}
      {canApply ? (
        isAuthenticated ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">이름</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={applicationData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">참여 가능 시간</label>
              <input
                type="text"
                className="form-control"
                name="availableTime"
                value={applicationData.availableTime}
                onChange={handleChange}
                placeholder="참여 가능 시간"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">지원 동기</label>
              <textarea
                className="form-control"
                name="reason"
                value={applicationData.reason}
                onChange={handleChange}
                placeholder="스터디 지원 동기"
                rows="3"
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-success">
                신청하기
              </button>
            </div>
          </form>
        ) : (
          <div className="alert alert-warning text-center">
            스터디 신청을 하려면 먼저 로그인 해주세요.
          </div>
        )
      ) : null}
    </div>
  );
};

export default StudyApply;
