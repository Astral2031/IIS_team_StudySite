USE study_hub;                                         -- 테이블 선택

CREATE TABLE users ( -- 사용자 기본 정보
  id INT AUTO_INCREMENT PRIMARY KEY,                   -- 자동 증가 ID
  email VARCHAR(255) NOT NULL UNIQUE,                  -- 로그인 이메일 (중복 불가)
  password VARCHAR(255) NOT NULL,                      -- 비밀번호 (암호화 저장)
  nickname VARCHAR(50) NOT NULL,                       -- 사용자 닉네임
  university VARCHAR(100) NULL,                        -- 소속 대학
  birthdate NULL,                                      -- 생년월일
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,       -- 가입 일자
  is_admin BOOLEAN DEFAULT FALSE                       -- 관리자 여부 (기본값 false)
);

CREATE TABLE studies ( -- 스터디 모집글 정보
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 스터디 ID
  title           VARCHAR(255) NOT NULL,                      -- 제목
  description     TEXT NOT NULL,                              -- 설명
  qualifications  TEXT,                                       -- 지원 자격
  max_members     INT NOT NULL,                               -- 모집 인원
  current_members INT DEFAULT 1,                              -- 현재 인원 (옵션)
  category        VARCHAR(100) NOT NULL,                      -- 카테고리 (문자열로 우선 처리)
  tags            VARCHAR(255),                               -- 태그 문자열 (쉼표 구분 등)
  mode            ENUM('online', 'offline', 'hybrid') NOT NULL, -- 진행 방식(온라인, 오프라인, 병행행)
  deadline        DATETIME,                                   -- 모집 마감일
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,         -- 생성일
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일
  host_id         INT NOT NULL,                               -- 작성자 (users 테이블 참조)

  FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE -- 작성자 삭제 시 모집글도 삭제
);

CREATE TABLE study_applications ( -- 스터디 지원 기록
  id BIGINT AUTO_INCREMENT PRIMARY KEY,                              -- 지원 ID
  study_id BIGINT NOT NULL,                                          -- 지원한 스터디 ID
  user_id INT NOT NULL,                                              -- 지원자 ID
  message TEXT,                                                      -- 자기소개 또는 지원 메시지
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',  -- 지원 상태(대기 중, 승인, 거절)
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,                     -- 지원 일시

  FOREIGN KEY (study_id) REFERENCES studies(id) ON DELETE CASCADE,   -- 스터디 삭제 시 지원 내역 삭제
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE       -- 사용자 삭제 시 지원 내역 삭제
);

CREATE TABLE study_members ( -- 스터디 멤버 목록
  id BIGINT AUTO_INCREMENT PRIMARY KEY,                         -- 멤버 ID
  study_id BIGINT NOT NULL,                                     -- 스터디 ID
  user_id INT NOT NULL,                                         -- 사용자 ID
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,                 -- 참가 일자

  FOREIGN KEY (study_id) REFERENCES studies(id) ON DELETE CASCADE, -- 스터디 삭제 시 멤버도 삭제
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE     -- 사용자 삭제 시 멤버도 삭제
);

