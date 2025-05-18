// src/pages/SignIn.js
import { useAuth } from "../contexts/AuthContext.js";

import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 후 이전 페이지로 돌아가기 위한 처리
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({ email, password }); // email, password는 상태
      navigate("/"); // 로그인 성공 후 이동
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4">로그인</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  이메일
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  비밀번호
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "처리 중..." : "로그인"}
              </button>
            </form>

            <div className="text-center mt-3">
              <p>
                계정이 없으신가요? <Link to="/signup">회원가입</Link>
              </p>
            </div>

            {/* 테스트용 계정 정보 안내 */}
            <div className="alert alert-info mt-3">
              <strong>테스트 계정:</strong>
              <br />
              이메일: test@example.com
              <br />
              비밀번호: password
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
