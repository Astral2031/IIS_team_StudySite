import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient.js"; // API 클라이언트 설정

function MyStudies() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await apiClient.get("/studies/my"); // 참여 중인 스터디
        console.log("내 스터디 목록:", res.data);
        setStudies(res.data);
      } catch (err) {
        alert("스터디 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, []);

  if (loading) return <p className="text-center">로딩 중...</p>;

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
                  인원수: {study.current_members}/{study.max_members}명
                </p>
                <p className="card-text">
                  시작일: {new Date(study.created_at).toLocaleDateString()}
                </p>
                <Link
                  to={`/study-apply/${study.id}`}
                  state={{ canApply: false }}
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
