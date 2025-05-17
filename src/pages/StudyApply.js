// src/pages/StudyApply.js
import { studyService } from "../services/storageService";
import { useAuth } from "../contexts/AuthContext";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const StudyApply = () => {
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState({
    name: "",
    school: "",
    qualification: "",
    availableTime: "",
    reason: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: `/study-apply/${id}` } });
      return;
    }

    // 스터디 정보 가져오기
    const foundStudy = studyService.getStudyById(id);

    if (foundStudy) {
      setStudy(foundStudy);
      // 현재 사용자 정보로 초기화
      if (currentUser) {
        setApplicationData((prev) => ({
          ...prev,
          name: currentUser.name || "",
        }));
      }
    }
    setLoading(false);
  }, [id, isAuthenticated, navigate, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 실제로는 여기서 API 호출을 해야 하지만 현재는 알림만 표시
    alert("스터디 신청이 완료되었습니다! (데모 기능)");
    navigate("/study-list");
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
      <div className="container py-4">
        <div className="alert alert-danger text-center">
          스터디를 찾을 수 없습니다.
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate("/study-list")}
            className="btn btn-primary"
          >
            스터디 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">스터디 신청하기</h2>

              <div className="mb-4 p-3 bg-light rounded">
                <h3>{study.title}</h3>
                <p className="mb-1">주제: {study.subject}</p>
                <p className="mb-1">카테고리: {study.category}</p>
                <p className="card-text">
                  인원수:{" "}
                  {study.participants || study.memberCount || study.members}/
                  {study.maxParticipants || study.maxMembers}명
                </p>
                {study.description && (
                  <p className="mb-0 mt-2">{study.description}</p>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <h4 className="card-subtitle mb-3">내 프로필</h4>

                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">이름:</span>
                      <input
                        type="text"
                        className="form-control"
                        value={applicationData.name}
                        onChange={(e) =>
                          setApplicationData({
                            ...applicationData,
                            name: e.target.value,
                          })
                        }
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">학교:</span>
                      <input
                        type="text"
                        className="form-control"
                        name="school"
                        value={applicationData.school}
                        onChange={handleChange}
                        placeholder="학교명을 입력하세요"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">자격증:</span>
                      <input
                        type="text"
                        className="form-control"
                        name="qualification"
                        value={applicationData.qualification}
                        onChange={handleChange}
                        placeholder="보유한 자격증을 입력하세요"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
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
                  <input
                    type="text"
                    className="form-control"
                    name="reason"
                    value={applicationData.reason}
                    onChange={handleChange}
                    placeholder="스터디 경험"
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-success">
                    신청하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyApply;
