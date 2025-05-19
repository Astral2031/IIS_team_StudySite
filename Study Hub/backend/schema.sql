-- 사용자 기본 정보
CREATE TABLE users ( 
  id INT AUTO_INCREMENT PRIMARY KEY,                   -- 자동 증가 ID
  email VARCHAR(255) NOT NULL UNIQUE,                  -- 로그인 이메일 (중복 불가)
  password VARCHAR(255) NOT NULL,                      -- 비밀번호 (암호화 저장)
  nickname VARCHAR(50) NOT NULL,                       -- 사용자 닉네임
  university VARCHAR(100) NULL,                        -- 소속 대학
  birthdate NULL,                                      -- 생년월일
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




