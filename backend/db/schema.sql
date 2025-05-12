USE study_hub;                                         -- 테이블 선택

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,                   -- 자동 증가 ID
  email VARCHAR(255) NOT NULL UNIQUE,                  -- 로그인 이메일 (중복 불가)
  password VARCHAR(255) NOT NULL,                      -- 비밀번호 (암호화 저장)
  nickname VARCHAR(50) NOT NULL,                       -- 사용자 닉네임
  university VARCHAR(100) NOT NULL,                    -- 소속 대학
  birthdate DATE NOT NULL,                             -- 생년월일
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,       -- 가입 일자
  is_admin BOOLEAN DEFAULT FALSE                       -- 관리자 여부 (기본값 false)
);

