CREATE DATABASE Study_Hub CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;


USE Study_Hub;


-- 사용자 기본 정보
CREATE TABLE users ( 
  id INT AUTO_INCREMENT PRIMARY KEY,                   -- 자동 증가 ID
  email VARCHAR(255) NOT NULL UNIQUE,                  -- 로그인 이메일 (중복 불가)
  password VARCHAR(255) NOT NULL,                      -- 비밀번호 (암호화 저장)
  nickname VARCHAR(50) NOT NULL,                       -- 사용자 닉네임
  university VARCHAR(100) NULL,                        -- 소속 대학
  birthdate DATE NULL,                                      -- 생년월일
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,       -- 가입 일자
  is_admin BOOLEAN DEFAULT FALSE                       -- 관리자 여부 (기본값 false)
);


-- 스터디 모집글 정보
CREATE TABLE studies ( 
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 스터디 ID
  title           VARCHAR(255) NOT NULL,                      -- 제목
  description     TEXT NOT NULL,                              -- 설명
  subject         VARCHAR(255) NOT NULL,                      -- 주제
  max_members     INT NOT NULL,                               -- 모집 인원
  current_members INT DEFAULT 1,                              -- 현재 인원 (옵션)
  category        VARCHAR(100) NOT NULL,                      -- 카테고리 (문자열로 우선 처리)
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,         -- 생성일
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일
  host_id         INT NOT NULL,                               -- 작성자 (users 테이블 참조)

  FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE -- 작성자 삭제 시 모집글도 삭제
);


-- 스터디 지원 기록
CREATE TABLE study_applications ( 
  id BIGINT AUTO_INCREMENT PRIMARY KEY,                              -- 지원 ID
  study_id BIGINT NOT NULL,                                          -- 지원한 스터디 ID
  user_id INT NOT NULL,                                              -- 지원자 ID
  message TEXT,                                                      -- 자기소개 또는 지원 메시지
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',  -- 지원 상태(대기 중, 승인, 거절)
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,                     -- 지원 일시

  FOREIGN KEY (study_id) REFERENCES studies(id) ON DELETE CASCADE,   -- 스터디 삭제 시 지원 내역 삭제
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE       -- 사용자 삭제 시 지원 내역 삭제
);


-- 스터디 멤버 목록
CREATE TABLE study_members ( 
  id BIGINT AUTO_INCREMENT PRIMARY KEY,                         -- 멤버 ID
  study_id BIGINT NOT NULL,                                     -- 스터디 ID
  user_id INT NOT NULL,                                         -- 사용자 ID
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,                 -- 참가 일자

  FOREIGN KEY (study_id) REFERENCES studies(id) ON DELETE CASCADE, -- 스터디 삭제 시 멤버도 삭제
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE     -- 사용자 삭제 시 멤버도 삭제
);


-- 공지사항
CREATE TABLE notice_posts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,              -- 공지글 ID
  title VARCHAR(255) NOT NULL,                       -- 제목
  content TEXT NOT NULL,                             -- 내용
  views INT DEFAULT 0,                               -- 조회수
  likes INT DEFAULT 0,                               -- 추천 수
  author_id INT NOT NULL,                            -- 작성자 (users 참조)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,     
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);


-- 자유게시판
CREATE TABLE free_posts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,              -- 자유글 ID
  title VARCHAR(255) NOT NULL,                       -- 제목 
  content TEXT NOT NULL,                             -- 내용
  views INT DEFAULT 0,                               -- 조회수
  likes INT DEFAULT 0,                               -- 추천 수
  author_id INT NOT NULL,                            -- 작성자 (users 참조)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Q&A
CREATE TABLE qna_posts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,              -- 질문글 ID
  title VARCHAR(255) NOT NULL,                       -- 제목 
  content TEXT NOT NULL,                             -- 내용
  views INT DEFAULT 0,                               -- 조회수
  likes INT DEFAULT 0,                               -- 추천 수
  author_id INT NOT NULL,                            -- 작성자 (users 참조)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 

  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);



-- 댓글
CREATE TABLE comments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,              -- 댓글 ID
  post_type ENUM('notice', 'free', 'qna') NOT NULL,  -- 게시판 종류
  post_id BIGINT NOT NULL,                           -- 해당 게시글 ID
  author_id INT NOT NULL,                            -- 댓글 작성자
  content TEXT NOT NULL,                             -- 댓글 내용
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,     -- 작성 시각
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);


-- 추천 기록
CREATE TABLE post_likes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,            -- 추천 기록 고유 ID
  post_type ENUM('notice', 'freetalk', 'qna') NOT NULL,-- 게시판 종류
  post_id BIGINT NOT NULL,                         -- 추천한 게시글 ID
  user_id INT NOT NULL,                            -- 추천한 사용자 ID
  liked_at DATETIME DEFAULT CURRENT_TIMESTAMP,     -- 추천한 시각

  UNIQUE(post_type, post_id, user_id),             -- 동일 유저가 동일 게시글에 중복 추천 불가

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  -- 사용자 삭제 시 추천 기록도 삭제
);


--예제 데이터 삽입
INSERT INTO users (email, password, nickname, university, birthdate, is_admin)
VALUES
('admin@example.com', '$2b$10$EouFSYYWn.LJwzZHatyD5eZQVEWV1PQ128XZhSEHKhuzKp8Hi/Z2y', '관리자', '경성대학교', '2002-01-01', TRUE),
('user1@example.com', '$2b$10$EouFSYYWn.LJwzZHatyD5eZQVEWV1PQ128XZhSEHKhuzKp8Hi/Z2y', '홍길동', '서울대학교', '2000-05-20', FALSE),
('user2@example.com', '$2b$10$EouFSYYWn.LJwzZHatyD5eZQVEWV1PQ128XZhSEHKhuzKp8Hi/Z2y', '김철수', '카이스트', '1999-03-15', FALSE),
('user3@example.com', '$2b$10$EouFSYYWn.LJwzZHatyD5eZQVEWV1PQ128XZhSEHKhuzKp8Hi/Z2y', '이영희', '고려대학교', '1997-07-15', FALSE);

INSERT INTO studies (title, description, subject, max_members, current_members, category, host_id)
VALUES
('웹 개발 스터디', '매주 토요일에 만나요', '웹프론트엔드', 5, 2, 'IT 개발', 1),
('AI 논문 읽기 모임', '영어 논문 읽고 토론해요', '인공지능', 4, 1, 'IT 개발', 2),
('토익 스터디', '목표 900점! 스터디원 구해요', '영어', 6, 3, '언어', 1),
('포토샵 마스터', '디자인 포트폴리오 같이 만들어요', '그래픽 디자인', 5, 2, '디자인', 3),
('정보처리기사 실전반', '기출풀이 위주로 준비합니다', '자격증', 8, 4, '자격증', 2),
('자기계발 독서 모임', '성장하는 사람들의 독서 모임', '자기계발', 10, 5, '자기개발', 1),
('백엔드 마이크로서비스 설계', 'Node.js + Docker 연습합니다', '백엔드', 4, 1, 'IT 개발', 3);

INSERT INTO study_applications (study_id, user_id, message, status)
VALUES
(1, 2, '웹 개발에 관심 많아요!', 'pending'),
(2, 3, 'AI 전공입니다! 같이 공부하고 싶어요.', 'accepted');

INSERT INTO study_members (study_id, user_id)
VALUES
(1, 1),  -- 관리자
(1, 2),
(2, 2);  -- 중복 멤버 예시

INSERT INTO notice_posts (title, content, author_id)
VALUES
('사이트 오픈 안내', '스터디 모집 플랫폼이 오픈했습니다!', 1);

INSERT INTO free_posts (title, content, author_id)
VALUES
('오늘 날씨 너무 좋네요~', '공부는 하기 싫고... 산책이나 할까?', 2),
('스터디 추천해 주세요!', '백엔드 위주로 공부하는 사람 모임 있나요?', 3);

INSERT INTO qna_posts (title, content, author_id)
VALUES
('React useState 질문 있어요', 'useState에 초기값으로 배열 넣을 때 주의할 점이 뭔가요?', 3);

INSERT INTO comments (post_type, post_id, author_id, content)
VALUES
('free', 1, 3, '저도요! 오늘 너무 좋네요~'),
('qna', 1, 1, '초기값은 항상 새로운 배열로 넣어주세요.');

INSERT INTO post_likes (post_type, post_id, user_id)
VALUES
('freetalk', 1, 2),
('qna', 1, 1);


