// src/pages/MyStudies.js
import { Link } from "react-router-dom";
import { useState } from "react";

function MyStudies() {
  // isAuthenticated 변수 제거 (사용하지 않음)

  const [studies] = useState([
    {
      id: 1,
      title: "React 스터디",
      participants: 5,
      maxParticipants: 8,
      startDate: "2025-01-02",
    },
    {
      id: 2,
      title: "Node.js 심화",
      participants: 3,
      maxParticipants: 6,
      startDate: "2025-01-04",
    },
    {
      id: 3,
      title: "데이터베이스 마스터",
      participants: 4,
      maxParticipants: 8,
      startDate: "2025-02-15",
    },
    {
      id: 4,
      title: "웹 개발 스터디",
      participants: 6,
      maxParticipants: 10,
      startDate: "2025-03-10",
    },
  ]);
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📚 내 스터디 리스트</h2>

      <div className="row">
        {studies.map((study) => (
          <div key={study.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">{study.title}</h3>
                <p className="card-text">
                  인원수:{" "}
                  {study.participants || study.memberCount || study.members}/
                  {study.maxParticipants || study.maxMembers}명
                </p>
                <p className="card-text">시작일: {study.startDate}</p>
                <Link
                  to={`/study-apply/${study.id}`}
                  className="btn btn-primary"
                >
                  상세 보기
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {studies.length === 0 && (
        <div className="alert alert-info text-center">
          참여 중인 스터디가 없습니다. 스터디에 참여해보세요!
        </div>
      )}

      <div className="text-center mt-4">
        <Link to="/study-list" className="btn btn-outline-primary">
          스터디 목록 보기
        </Link>
      </div>
    </div>
  );
}

export default MyStudies;
