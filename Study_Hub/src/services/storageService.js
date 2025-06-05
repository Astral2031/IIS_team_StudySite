// src/services/storageService.js
// 로컬 스토리지를 활용한 데이터 관리 서비스

// 초기 데이터 설정 (앱 처음 실행 시)
const initializeStorage = () => {
  // 게시글 데이터가 없으면 초기화
  if (!localStorage.getItem("posts")) {
    const initialPosts = [
      // 여기 initialPosts 배열 내용은 그대로 유지됩니다...
    ];

    localStorage.setItem("posts", JSON.stringify(initialPosts));
  }

  // 인기 스터디 그룹 데이터가 없으면 초기화
  if (!localStorage.getItem("popularStudies")) {
    const popularStudies = [
      {
        id: 1,
        title: "React 실전 프로젝트",
        description: "React로 실무 프로젝트를 진행하며 포트폴리오를 만들어요.",
        participants: 8, // memberCount → participants
        maxParticipants: 10, // maxMembers → maxParticipants
        likeCount: 25,
      },
      {
        id: 2,
        title: "파이썬 데이터 분석",
        description: "파이썬으로 데이터를 분석하고 시각화하는 방법을 배워요.",
        participants: 7, // memberCount → participants
        maxParticipants: 8, // maxMembers → maxParticipants
        likeCount: 18,
      },
      {
        id: 3,
        title: "CS 기초 스터디",
        description: "전산학 기초 지식을 함께 공부해요.",
        participants: 10, // memberCount → participants
        maxParticipants: 12, // maxMembers → maxParticipants
        likeCount: 15,
      },
    ];

    localStorage.setItem("popularStudies", JSON.stringify(popularStudies));
  }

  // 신규 스터디 그룹 데이터가 없으면 초기화
  if (!localStorage.getItem("newStudies")) {
    const newStudies = [
      {
        id: 4,
        title: "자바 기초 스터디",
        description: "자바 프로그래밍의 기초를 함께 공부해요.",
        participants: 4, // memberCount → participants
        maxParticipants: 6, // maxMembers → maxParticipants
        createdAt: "2025-05-08",
      },
      {
        id: 5,
        title: "알고리즘 스터디",
        description: "코딩 테스트 대비 알고리즘 문제를 풀어봐요.",
        participants: 3, // memberCount → participants
        maxParticipants: 5, // maxMembers → maxParticipants
        createdAt: "2025-05-09",
      },
      {
        id: 6,
        title: "웹 개발 스터디",
        description: "HTML, CSS, JavaScript를 활용한 웹 개발을 배워요.",
        participants: 5, // memberCount → participants
        maxParticipants: 8, // maxMembers → maxParticipants
        createdAt: "2025-05-10",
      },
    ];

    localStorage.setItem("newStudies", JSON.stringify(newStudies));
  }

  // 좋아요 정보 초기화
  if (!localStorage.getItem("likeInfo")) {
    localStorage.setItem("likeInfo", JSON.stringify({}));
  }

  // 로그인 정보 초기화 (관리자 계정 추가)
  if (!localStorage.getItem("users")) {
    const users = [
      {
        id: 1,
        name: "관리자",
        email: "admin@example.com",
        password: "admin123", // 실제로는 해시 처리 필요
        role: "admin", // 관리자 역할 추가
      },
      {
        id: 2,
        name: "테스트 사용자",
        email: "test@example.com",
        password: "password", // 실제로는 해시 처리 필요
        role: "user", // 일반 사용자 역할
      },
    ];

    localStorage.setItem("users", JSON.stringify(users));
  } else {
    // 기존 사용자 데이터가 있다면 관리자 계정 추가 확인
    const users = JSON.parse(localStorage.getItem("users"));
    const adminExists = users.some((user) => user.role === "admin");

    if (!adminExists) {
      // 관리자 계정이 없으면 추가
      users.push({
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        name: "관리자",
        email: "admin@example.com",
        password: "admin123", // 실제로는 해시 처리 필요
        role: "admin",
      });
      localStorage.setItem("users", JSON.stringify(users));
    }
  }

  // 관리자 계정 정보 콘솔에 출력
  console.log("관리자 계정 정보:", {
    email: "admin@example.com",
    password: "admin123",
  });
};

// 게시글 관련 서비스
const postService = {
  getAllPosts: () => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    // 최신순 정렬
    return [...posts].sort((a, b) => {
      const dateA = new Date(a.createdAt.replace(/-/g, "/"));
      const dateB = new Date(b.createdAt.replace(/-/g, "/"));
      return dateB - dateA; // 최신 게시글이 먼저 오도록 내림차순 정렬
    });
  },

  // 카테고리별 게시글 가져오기 (최신순 정렬)
  getPostsByCategory: (category) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const filteredPosts = posts.filter(
      (post) => post.category.toLowerCase() === category.toLowerCase()
    );
    // 최신순 정렬
    return [...filteredPosts].sort((a, b) => {
      const dateA = new Date(a.createdAt.replace(/-/g, "/"));
      const dateB = new Date(b.createdAt.replace(/-/g, "/"));
      return dateB - dateA; // 최신 게시글이 먼저 오도록 내림차순 정렬
    });
  },

  // 인기 게시글 가져오기 (좋아요 순으로 정렬)
  getPopularPosts: () => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    // 좋아요 순으로 정렬
    return [...posts].sort((a, b) => b.likeCount - a.likeCount).slice(0, 5);
  },

  // 특정 게시글 가져오기
  getPostById: (id) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    return posts.find((post) => post.id === parseInt(id));
  },

  // 게시글 조회수 증가
  increaseViewCount: (id) => {
    // 이미 불려진 적이 있는지 체크하기 위한 변수 추가
    const viewCountKey = `viewCount_${id}`;

    // 이미 함수가 호출된 적이 있는지 확인
    if (window.viewCountCalled && window.viewCountCalled[viewCountKey]) {
      return; // 이미 호출된 적이 있으면 아무것도 하지 않음
    }

    // 함수 호출 상태 저장
    if (!window.viewCountCalled) window.viewCountCalled = {};
    window.viewCountCalled[viewCountKey] = true;

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex((post) => post.id === parseInt(id));

    if (index !== -1) {
      posts[index].viewCount += 1;
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  },

  // 게시글 좋아요 처리
  likePost: (postId, userId) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex((post) => post.id === parseInt(postId));

    if (index !== -1) {
      // 이미 좋아요 한 경우 체크
      const likedIndex = posts[index].likedBy.indexOf(userId);

      if (likedIndex === -1) {
        // 좋아요 추가
        posts[index].likedBy.push(userId);
        posts[index].likeCount += 1;
      } else {
        // 좋아요 취소
        posts[index].likedBy.splice(likedIndex, 1);
        posts[index].likeCount -= 1;
      }

      localStorage.setItem("posts", JSON.stringify(posts));
      return posts[index];
    }

    return null;
  },

  // 댓글 추가
  addComment: (postId, comment) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex((post) => post.id === parseInt(postId));

    if (index !== -1) {
      const newComment = {
        id: Date.now(),
        ...comment,
        createdAt: new Date().toLocaleString("ko-KR"),
      };

      posts[index].comments.push(newComment);
      localStorage.setItem("posts", JSON.stringify(posts));
      return newComment;
    }

    return null;
  },

  // 답변 추가
  addAnswer: (postId, answer) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex((post) => post.id === parseInt(postId));

    if (index !== -1) {
      const newAnswer = {
        id: Date.now(),
        ...answer,
        isAnswer: true,
        createdAt: new Date().toLocaleString("ko-KR"),
      };

      posts[index].comments.push(newAnswer);
      posts[index].hasAnswer = true;
      localStorage.setItem("posts", JSON.stringify(posts));
      return newAnswer;
    }

    return null;
  },

  // 게시글 생성 (수정: 관리자 권한 체크 추가)
  createPost: (post, user) => {
    // 공지사항인 경우 관리자 권한 체크
    if (post.category === "notice" && (!user || user.role !== "admin")) {
      throw new Error("공지사항은 관리자만 작성할 수 있습니다.");
    }

    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    // 현재 존재하는 게시글 ID 목록 가져오기
    const existingIds = posts.map((p) => p.id);

    // ID 자동 할당 (1부터 시작하여 사용 가능한 가장 작은 번호 찾기)
    let newId = 1;
    while (existingIds.includes(newId)) {
      newId++;
    }

    const newPost = {
      id: newId,
      ...post,
      viewCount: 0,
      likeCount: 0,
      comments: [],
      createdAt: new Date().toLocaleString("ko-KR"),
      likedBy: [],
    };

    posts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));
    return newPost;
  },

  // 게시글 검색 (최신순 정렬)
  searchPosts: (query) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const searchTerm = query.toLowerCase();

    const filteredPosts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm)
    );

    // 최신순 정렬
    return [...filteredPosts].sort((a, b) => {
      const dateA = new Date(a.createdAt.replace(/-/g, "/"));
      const dateB = new Date(b.createdAt.replace(/-/g, "/"));
      return dateB - dateA; // 최신 게시글이 먼저 오도록 내림차순 정렬
    });
  },

  // 새로 추가된 기능들

  // 게시글 수정 (수정: 관리자 권한 체크 추가)
  updatePost: (postId, user, updatedData) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex((post) => post.id === parseInt(postId));

    if (index === -1) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    const post = posts[index];

    // 게시글 작성자 또는 관리자만 수정 가능
    const isAuthor = post.authorId === user.id || post.author === user.name;
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      throw new Error("게시글 수정 권한이 없습니다.");
    }

    // 공지사항으로 카테고리 변경 시 관리자 권한 체크
    if (updatedData.category === "notice" && !isAdmin) {
      throw new Error("공지사항은 관리자만 작성/수정할 수 있습니다.");
    }

    // 게시글 정보 업데이트
    const updatedPost = {
      ...posts[index],
      ...updatedData,
      updatedAt: new Date().toLocaleString("ko-KR"), // 수정 시간 추가
    };
    // 게시글 정보 변경 금지 항목 유지
    updatedPost.id = posts[index].id;
    updatedPost.author = posts[index].author;
    updatedPost.authorId = posts[index].authorId;
    updatedPost.createdAt = posts[index].createdAt;
    updatedPost.viewCount = posts[index].viewCount;
    updatedPost.likeCount = posts[index].likeCount;
    updatedPost.comments = posts[index].comments;
    updatedPost.likedBy = posts[index].likedBy;

    posts[index] = updatedPost;
    localStorage.setItem("posts", JSON.stringify(posts));
    return updatedPost;
  },

  // 게시글 삭제 (수정: 관리자 권한 체크 추가)
  deletePost: (postId, user) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex((post) => post.id === parseInt(postId));

    if (index === -1) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    const post = posts[index];

    // 게시글 작성자 또는 관리자만 삭제 가능
    const isAuthor = post.authorId === user.id || post.author === user.name;
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      throw new Error("게시글 삭제 권한이 없습니다.");
    }

    // 게시글 삭제
    const deletedPost = posts.splice(index, 1)[0];
    localStorage.setItem("posts", JSON.stringify(posts));
    return deletedPost;
  },

  // 댓글 수정
  updateComment: (postId, commentId, userId, updatedContent) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIndex = posts.findIndex((post) => post.id === parseInt(postId));

    if (postIndex === -1) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    const commentIndex = posts[postIndex].comments.findIndex(
      (comment) => comment.id === parseInt(commentId)
    );

    if (commentIndex === -1) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }

    // 댓글 작성자 확인
    if (posts[postIndex].comments[commentIndex].authorId !== userId) {
      throw new Error("본인이 작성한 댓글만 수정할 수 있습니다.");
    }

    // 댓글 수정
    posts[postIndex].comments[commentIndex].content = updatedContent;
    posts[postIndex].comments[commentIndex].updatedAt =
      new Date().toLocaleString("ko-KR");
    posts[postIndex].comments[commentIndex].isEdited = true; // 수정됨 표시

    localStorage.setItem("posts", JSON.stringify(posts));
    return posts[postIndex].comments[commentIndex];
  },

  // 댓글 삭제
  deleteComment: (postId, commentId, userId) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIndex = posts.findIndex((post) => post.id === parseInt(postId));

    if (postIndex === -1) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    const commentIndex = posts[postIndex].comments.findIndex(
      (comment) => comment.id === parseInt(commentId)
    );

    if (commentIndex === -1) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }

    // 댓글 작성자 확인
    if (posts[postIndex].comments[commentIndex].authorId !== userId) {
      throw new Error("본인이 작성한 댓글만 삭제할 수 있습니다.");
    }

    // 댓글 삭제
    const deletedComment = posts[postIndex].comments.splice(commentIndex, 1)[0];

    // 삭제된 댓글이 답변이었는지 확인하고 게시글의 hasAnswer 상태 업데이트
    if (deletedComment.isAnswer) {
      // 다른 답변이 있는지 확인
      const hasOtherAnswers = posts[postIndex].comments.some(
        (comment) => comment.isAnswer
      );
      posts[postIndex].hasAnswer = hasOtherAnswers;
    }

    localStorage.setItem("posts", JSON.stringify(posts));
    return deletedComment;
  },

  // 사용자가 작성한 게시글 가져오기
  getUserPosts: (userId) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const userPosts = posts.filter(
      (post) => post.authorId === parseInt(userId)
    );

    // 최신순 정렬
    return [...userPosts].sort((a, b) => {
      const dateA = new Date(a.createdAt.replace(/-/g, "/"));
      const dateB = new Date(b.createdAt.replace(/-/g, "/"));
      return dateB - dateA;
    });
  },

  // 사용자가 작성한 댓글 가져오기
  getUserComments: (userId) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const userComments = [];

    // 모든 게시글을 순회하며 사용자가 작성한 댓글 찾기
    posts.forEach((post) => {
      const comments = post.comments.filter(
        (comment) => comment.authorId === parseInt(userId)
      );

      if (comments.length > 0) {
        comments.forEach((comment) => {
          userComments.push({
            postId: post.id,
            postTitle: post.title,
            comment,
          });
        });
      }
    });

    // 최신순 정렬
    return [...userComments].sort((a, b) => {
      const dateA = new Date(a.comment.createdAt.replace(/-/g, "/"));
      const dateB = new Date(b.comment.createdAt.replace(/-/g, "/"));
      return dateB - dateA;
    });
  },
};

// defaultStudies 배열 추가
const defaultStudies = [
  {
    id: 1,
    title: "React 초급 스터디",
    subject: "프론트엔드",
    category: "IT 개발",
    participants: 5,
    maxParticipants: 10,
    createdAt: "2025-01-01",
    description: "리액트 기초부터 함께 배워요",
    likeCount: 15,
  },
  {
    id: 2,
    title: "Node.js 백엔드 스터디",
    subject: "백엔드",
    category: "IT 개발",
    participants: 4,
    maxParticipants: 10,
    createdAt: "2025-01-02",
    description: "백엔드 개발의 기초를 다집니다",
    likeCount: 12,
  },
  {
    id: 3,
    title: "Python 데이터 분석",
    subject: "데이터 분석",
    category: "IT 개발",
    participants: 6,
    maxParticipants: 8,
    createdAt: "2025-01-03",
    description: "파이썬으로 데이터 분석하기",
    likeCount: 20,
  },
  {
    id: 4,
    title: "자바 알고리즘 스터디",
    subject: "알고리즘",
    category: "IT 개발",
    participants: 3,
    maxParticipants: 10,
    createdAt: "2025-01-05",
    description: "코딩 테스트 대비 알고리즘",
    likeCount: 8,
  },
  {
    id: 5,
    title: "영어 회화 스터디",
    subject: "회화",
    category: "언어",
    participants: 3,
    maxParticipants: 5,
    createdAt: "2025-01-10",
    description: "원어민과 함께하는 영어회화",
    likeCount: 18,
  },
  {
    id: 6,
    title: "일본어 초급 스터디",
    subject: "기초 일본어",
    category: "언어",
    participants: 4,
    maxParticipants: 6,
    createdAt: "2025-01-15",
    description: "일본어 기초부터 차근차근",
    likeCount: 9,
  },
  {
    id: 7,
    title: "스페인어 문법 스터디",
    subject: "스페인어",
    category: "언어",
    participants: 2,
    maxParticipants: 5,
    createdAt: "2025-02-01",
    description: "스페인어 문법 심화 학습",
    likeCount: 4,
  },
  {
    id: 8,
    title: "UI/UX 디자인 스터디",
    subject: "디자인",
    category: "디자인",
    participants: 4,
    maxParticipants: 8,
    createdAt: "2025-02-05",
    description: "UI/UX 디자인 기초와 실습",
    likeCount: 10,
  },
  {
    id: 9,
    title: "웹디자인 실습 스터디",
    subject: "웹디자인",
    category: "디자인",
    participants: 5,
    maxParticipants: 7,
    createdAt: "2025-02-10",
    description: "웹디자인 포트폴리오 만들기",
    likeCount: 14,
  },
  {
    id: 10,
    title: "그래픽 디자인 스터디",
    subject: "Adobe Illustrator",
    category: "디자인",
    participants: 3,
    maxParticipants: 6,
    createdAt: "2025-02-15",
    description: "그래픽 디자인 기초 학습",
    likeCount: 7,
  },
  {
    id: 11,
    title: "정보처리기사 시험 준비 스터디",
    subject: "자격증",
    category: "자격증",
    participants: 6,
    maxParticipants: 8,
    createdAt: "2025-03-01",
    description: "정보처리기사 실기 대비",
    likeCount: 16,
  },
  {
    id: 12,
    title: "토익 점수 향상 스터디",
    subject: "영어 자격증",
    category: "자격증",
    participants: 2,
    maxParticipants: 6,
    createdAt: "2025-03-05",
    description: "토익 800점 목표",
    likeCount: 5,
  },
  {
    id: 13,
    title: "토플 시험 준비 스터디",
    subject: "영어 자격증",
    category: "자격증",
    participants: 4,
    maxParticipants: 6,
    createdAt: "2025-03-10",
    description: "토플 100점 목표",
    likeCount: 11,
  },
  {
    id: 14,
    title: "자기개발 독서 스터디",
    subject: "자기개발",
    category: "자기개발",
    participants: 5,
    maxParticipants: 10,
    createdAt: "2025-03-15",
    description: "한 달에 한 권 읽기",
    likeCount: 19,
  },
  {
    id: 15,
    title: "심리학 공부 스터디",
    subject: "심리학",
    category: "자기개발",
    participants: 3,
    maxParticipants: 6,
    createdAt: "2025-03-20",
    description: "심리학 기초 이론 학습",
    likeCount: 13,
  },
  {
    id: 16,
    title: "독서 토론 스터디",
    subject: "독서&토론",
    category: "자기개발",
    participants: 4,
    maxParticipants: 5,
    createdAt: "2025-03-25",
    description: "매주 정해진 책 한 권 읽어오고 함께 토론하기",
    likeCount: 6,
  },
];

// 스터디 관련 서비스
const studyService = {
  // 스터디 검색
  searchStudies: (query) => {
    const allStudies = studyService.getAllStudies();
    const searchTerm = query.toLowerCase();

    const filteredStudies = allStudies.filter(
      (study) =>
        study.title.toLowerCase().includes(searchTerm) ||
        (study.subject && study.subject.toLowerCase().includes(searchTerm)) ||
        (study.description &&
          study.description.toLowerCase().includes(searchTerm)) ||
        (study.category && study.category.toLowerCase().includes(searchTerm))
    );

    // 최신순 정렬 (생성일 기준)
    return [...filteredStudies].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // 최신 스터디가 먼저 오도록 내림차순 정렬
    });
  },
  // 인기 스터디 가져오기 (수정 버전)
  getPopularStudies: () => {
    // 항상 최신 데이터를 사용해서 좋아요 순으로 정렬
    const allStudies = studyService.getAllStudies();
    return [...allStudies]
      .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
      .slice(0, 3);
  },

  // 신규 스터디 가져오기 (수정 버전)
  getNewStudies: () => {
    // 항상 최신 데이터를 사용해서 날짜 순으로 정렬
    const allStudies = studyService.getAllStudies();
    return [...allStudies]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  },

  // 모든 스터디 가져오기 (기존 메서드)
  getAllStudies: () => {
    // localStorage에 사용자 정의 스터디가 있으면 불러오기, 없으면 빈 배열
    const customStudies =
      JSON.parse(localStorage.getItem("customStudies")) || [];
    return [...defaultStudies, ...customStudies];
  },

  // 카테고리별 필터링된 스터디 가져오기 (기존 메서드)
  getFilteredStudies: (category) => {
    const allStudies = studyService.getAllStudies();

    if (category === "전체") {
      return allStudies;
    } else if (category === "직접 작성") {
      const customStudies =
        JSON.parse(localStorage.getItem("customStudies")) || [];
      return customStudies;
    } else {
      return allStudies.filter((study) => study.category === category);
    }
  },

  // 새 스터디 저장하기 (새 메서드)
  saveCustomStudy: (study) => {
    const customStudies =
      JSON.parse(localStorage.getItem("customStudies")) || [];

    // 새 스터디에 ID 부여 (기존 ID 중 가장 큰 값 + 1)
    const allStudies = studyService.getAllStudies();
    const maxId = Math.max(...allStudies.map((s) => s.id), 0);

    const newStudy = {
      ...study,
      id: maxId + 1,
      category: "직접 작성",
      createdAt: new Date().toISOString().split("T")[0], // YYYY-MM-DD 형식
      likeCount: 0,
    };

    customStudies.push(newStudy);
    localStorage.setItem("customStudies", JSON.stringify(customStudies));
    return newStudy;
  },

  // 사용자 정의 스터디 삭제하기 (새 메서드)
  deleteCustomStudy: (id) => {
    const customStudies =
      JSON.parse(localStorage.getItem("customStudies")) || [];
    const updatedCustomStudies = customStudies.filter(
      (study) => study.id !== id
    );
    localStorage.setItem("customStudies", JSON.stringify(updatedCustomStudies));
    return updatedCustomStudies;
  },

  // ID로 스터디 가져오기 (새 메서드)
  getStudyById: (id) => {
    const allStudies = studyService.getAllStudies();
    return allStudies.find((study) => study.id.toString() === id.toString());
  },

  // 스터디 신청하기 (새 메서드)
  applyForStudy: (studyId, applicationData) => {
    // localStorage에서 신청 정보를 가져오거나 초기화
    const applications =
      JSON.parse(localStorage.getItem("studyApplications")) || [];

    // 새 신청 정보 생성
    const newApplication = {
      id: Date.now(), // 고유 ID 생성
      studyId: parseInt(studyId),
      ...applicationData,
      status: "pending", // 상태: pending, accepted, rejected
      appliedAt: new Date().toISOString(),
    };

    // 이미 같은 사용자가 같은 스터디에 신청했는지 확인
    const alreadyApplied = applications.some(
      (app) =>
        app.studyId === parseInt(studyId) && app.email === applicationData.email
    );

    if (alreadyApplied) {
      throw new Error("이미 이 스터디에 신청하셨습니다.");
    }

    // 신청 정보 추가
    applications.push(newApplication);
    localStorage.setItem("studyApplications", JSON.stringify(applications));

    // 스터디 참가자 수 증가 (옵션)
    const allStudies = studyService.getAllStudies();
    const studyIndex = allStudies.findIndex((s) => s.id === parseInt(studyId));

    if (
      studyIndex !== -1 &&
      allStudies[studyIndex].participants <
        allStudies[studyIndex].maxParticipants
    ) {
      // 참가자 수 증가 (커스텀 스터디일 경우)
      if (allStudies[studyIndex].category === "직접 작성") {
        const customStudies =
          JSON.parse(localStorage.getItem("customStudies")) || [];
        const customIndex = customStudies.findIndex(
          (s) => s.id === parseInt(studyId)
        );

        if (customIndex !== -1) {
          customStudies[customIndex].participants += 1;
          localStorage.setItem("customStudies", JSON.stringify(customStudies));
        }
      }
    }

    return newApplication;
  },

  // 사용자의 스터디 신청 목록 가져오기 (새 메서드)
  getUserApplications: (userEmail) => {
    const applications =
      JSON.parse(localStorage.getItem("studyApplications")) || [];
    return applications.filter((app) => app.email === userEmail);
  },

  // 스터디의 신청자 목록 가져오기 (새 메서드)
  getStudyApplicants: (studyId) => {
    const applications =
      JSON.parse(localStorage.getItem("studyApplications")) || [];
    return applications.filter((app) => app.studyId === parseInt(studyId));
  },
};

// 사용자 인증 관련 서비스 (수정)
const authService = {
  // 로그인
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // 비밀번호 정보 제외하고 반환
      const { password, ...userInfo } = user;
      return userInfo;
    }

    return null;
  },

  // 회원가입
  register: (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 이메일 중복 체크
    if (users.some((u) => u.email === userData.email)) {
      throw new Error("이미 등록된 이메일입니다.");
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      role: "user", // 기본적으로 일반 사용자 역할 부여
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // 비밀번호 정보 제외하고 반환
    const { password, ...userInfo } = newUser;
    return userInfo;
  },

  // 현재 로그인한 사용자 정보 가져오기
  getCurrentUser: () => {
    const userJson = localStorage.getItem("currentUser");
    return userJson ? JSON.parse(userJson) : null;
  },

  // 관리자 여부 확인 함수 추가
  isAdmin: (user) => {
    return user && user.role === "admin";
  },
};

// 검색 통합 서비스
const searchService = {
  search: (query) => {
    // 게시글 검색
    const postResults = postService.searchPosts(query);
    // 스터디 검색 (추가)
    const studyResults = studyService.searchStudies(query);

    return {
      posts: postResults,
      studies: studyResults,
      // 필요한 경우 다른 검색 결과 추가
    };
  },
};

// 로컬 스토리지 초기화
initializeStorage();

export { postService, studyService, authService, searchService };
