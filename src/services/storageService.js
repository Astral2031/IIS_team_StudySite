// src/services/storageService.js
// 로컬 스토리지를 활용한 데이터 관리 서비스

// 초기 데이터 설정 (앱 처음 실행 시)
const initializeStorage = () => {
  // 게시글 데이터가 없으면 초기화
  if (!localStorage.getItem("posts")) {
    const initialPosts = [
      {
        id: 1,
        title: "스터디 허브 오픈 안내",
        content:
          "스터디 허브가 오픈되었습니다. 많은 이용 부탁드립니다.\n\n앞으로 다양한 스터디 관련 정보와 커뮤니티 활동을 지원하도록 하겠습니다.",
        author: "관리자",
        createdAt: "2025-05-06 14:30",
        viewCount: 120,
        likeCount: 15,
        category: "notice",
        comments: [
          {
            id: 1,
            content: "축하드립니다! 잘 이용하겠습니다.",
            author: "사용자1",
            createdAt: "2025-05-06 15:42",
            isAnswer: false,
          },
          {
            id: 2,
            content: "좋은 사이트네요. 자주 이용할게요.",
            author: "사용자2",
            createdAt: "2025-05-06 16:30",
            isAnswer: false,
          },
        ],
        isQuestion: false,
        hasAnswer: false,
        likedBy: [],
        authorId: 1, // 작성자 ID 추가
      },
      {
        id: 2,
        title: "이용 규칙 안내",
        content:
          "스터디 허브 이용 규칙을 안내드립니다.\n\n1. 서로 예의를 지켜주세요.\n2. 스터디 관련 정보는 정확하게 기재해주세요.\n3. 불법적인 내용이나 저작권을 침해하는 자료는 공유하지 마세요.",
        author: "관리자",
        createdAt: "2025-05-05 10:15",
        viewCount: 85,
        likeCount: 8,
        category: "notice",
        comments: [],
        isQuestion: false,
        hasAnswer: false,
        likedBy: [],
        authorId: 1, // 작성자 ID 추가
      },
      {
        id: 3,
        title: "자바 스터디 하실 분 모집합니다",
        content:
          "자바 기초부터 함께 공부할 스터디원을 모집합니다.\n\n매주 토요일 오후 2시, 강남역 인근 카페에서 진행합니다. 관심 있으신 분들은 댓글 남겨주세요!",
        author: "자바왕",
        createdAt: "2025-05-04 18:20",
        viewCount: 67,
        likeCount: 5,
        category: "freetalk",
        comments: [
          {
            id: 4,
            content: "참여 희망합니다! 초보자도 가능한가요?",
            author: "코딩초보",
            createdAt: "2025-05-04 19:15",
            isAnswer: false,
            authorId: 2, // 작성자 ID 추가
          },
          {
            id: 5,
            content: "네, 초보자도 환영합니다!",
            author: "자바왕",
            createdAt: "2025-05-04 20:30",
            isAnswer: false,
            authorId: 3, // 작성자 ID 추가
          },
        ],
        isQuestion: false,
        hasAnswer: false,
        likedBy: [],
        authorId: 3, // 작성자 ID 추가
      },
      {
        id: 4,
        title: "개발자 취업 준비 팁 공유합니다",
        content:
          "개발자 취업을 준비하면서 경험한 팁을 공유합니다.\n\n1. 포트폴리오는 양보다 질\n2. 기술 면접 준비는 CS 기초부터\n3. 코딩 테스트는 꾸준히 풀기\n4. 오픈 소스 프로젝트 참여하기\n5. 개발 블로그 운영하기",
        author: "취업성공",
        createdAt: "2025-05-03 09:10",
        viewCount: 95,
        likeCount: 45,
        category: "freetalk",
        comments: [
          {
            id: 6,
            content: "좋은 정보 감사합니다!",
            author: "취준생",
            createdAt: "2025-05-03 10:05",
            isAnswer: false,
            authorId: 4, // 작성자 ID 추가
          },
        ],
        isQuestion: false,
        hasAnswer: false,
        likedBy: [],
        authorId: 5, // 작성자 ID 추가
      },
      {
        id: 5,
        title: "스프링 부트 에러 해결 방법 질문드립니다",
        content:
          "스프링 부트에서 JPA 설정시 다음과 같은 에러가 발생합니다. 해결방법 알려주세요.\n\nError creating bean with name 'entityManagerFactory'",
        author: "스프링러버",
        createdAt: "2025-05-02 10:15",
        viewCount: 42,
        likeCount: 3,
        category: "qna",
        comments: [
          {
            id: 7,
            content:
              "의존성 주입 문제인 것 같습니다. application.properties 파일에서 데이터베이스 설정을 확인해보세요.",
            author: "스프링마스터",
            createdAt: "2025-05-02 11:30",
            isAnswer: true,
            authorId: 6, // 작성자 ID 추가
          },
        ],
        isQuestion: true,
        hasAnswer: true,
        likedBy: [],
        authorId: 7, // 작성자 ID 추가
      },
      {
        id: 6,
        title: "리액트 상태 관리 관련 질문",
        content:
          "리액트에서 여러 컴포넌트 간에 상태를 공유하는 가장 좋은 방법은 무엇인가요? Context API와 Redux 중 어떤 것을 사용하는 것이 좋을까요?",
        author: "리액트초보",
        createdAt: "2025-05-01 16:45",
        viewCount: 38,
        likeCount: 2,
        category: "qna",
        comments: [],
        isQuestion: true,
        hasAnswer: false,
        likedBy: [],
        authorId: 8, // 작성자 ID 추가
      },
      {
        id: 7,
        title: "백엔드 vs 프론트엔드, 무엇을 선택해야 할까요?",
        content:
          "개발 공부를 시작하려고 하는데, 백엔드와 프론트엔드 중 어느 쪽에 집중하는 것이 좋을까요? 각각의 장단점과 필요한 기술 스택을 알려주세요.",
        author: "코딩고수",
        createdAt: "2025-05-01 12:30",
        viewCount: 72,
        likeCount: 32,
        category: "qna",
        comments: [
          {
            id: 8,
            content:
              "본인의 성향에 맞는 것을 선택하세요. 프론트엔드는 시각적인 결과물이 바로 보이는 것이 장점이고, 백엔드는 서버와 데이터 처리에 집중하므로 논리적 사고력이 중요합니다.",
            author: "풀스택개발자",
            createdAt: "2025-05-01 13:20",
            isAnswer: true,
            authorId: 9, // 작성자 ID 추가
          },
        ],
        isQuestion: true,
        hasAnswer: true,
        likedBy: [],
        authorId: 10, // 작성자 ID 추가
      },
      {
        id: 8,
        title: "프론트엔드 개발자 로드맵 2025",
        content:
          "프론트엔드 개발자가 되기 위해 공부해야 할 기술들의 로드맵을 공유합니다.\n\n1. HTML, CSS, JavaScript 기초\n2. 모던 JavaScript (ES6+)\n3. React, Vue, Angular 중 하나 선택\n4. 상태 관리 (Redux, MobX)\n5. TypeScript\n6. 테스팅 (Jest, React Testing Library)\n7. 웹 성능 최적화",
        author: "웹마스터",
        createdAt: "2025-05-04 14:15",
        viewCount: 88,
        likeCount: 38,
        category: "freetalk",
        comments: [],
        isQuestion: false,
        hasAnswer: false,
        likedBy: [],
        authorId: 11, // 작성자 ID 추가
      },
    ];

    localStorage.setItem("posts", JSON.stringify(initialPosts));
  }

  // 기존 코드 유지...
  // 인기 스터디 그룹 데이터가 없으면 초기화
  if (!localStorage.getItem("popularStudies")) {
    const popularStudies = [
      {
        id: 1,
        title: "React 실전 프로젝트",
        description: "React로 실무 프로젝트를 진행하며 포트폴리오를 만들어요.",
        memberCount: 8,
        maxMembers: 10,
        likeCount: 25,
      },
      {
        id: 2,
        title: "파이썬 데이터 분석",
        description: "파이썬으로 데이터를 분석하고 시각화하는 방법을 배워요.",
        memberCount: 7,
        maxMembers: 8,
        likeCount: 18,
      },
      {
        id: 3,
        title: "CS 기초 스터디",
        description: "전산학 기초 지식을 함께 공부해요.",
        memberCount: 10,
        maxMembers: 12,
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
        memberCount: 4,
        maxMembers: 6,
        createdAt: "2025-05-08",
      },
      {
        id: 5,
        title: "알고리즘 스터디",
        description: "코딩 테스트 대비 알고리즘 문제를 풀어봐요.",
        memberCount: 3,
        maxMembers: 5,
        createdAt: "2025-05-09",
      },
      {
        id: 6,
        title: "웹 개발 스터디",
        description: "HTML, CSS, JavaScript를 활용한 웹 개발을 배워요.",
        memberCount: 5,
        maxMembers: 8,
        createdAt: "2025-05-10",
      },
    ];

    localStorage.setItem("newStudies", JSON.stringify(newStudies));
  }

  // 좋아요 정보 초기화
  if (!localStorage.getItem("likeInfo")) {
    localStorage.setItem("likeInfo", JSON.stringify({}));
  }

  // 로그인 정보 초기화
  if (!localStorage.getItem("users")) {
    const users = [
      {
        id: 1,
        name: "테스트 사용자",
        email: "test@example.com",
        password: "password", // 실제로는 해시 처리 필요
      },
    ];

    localStorage.setItem("users", JSON.stringify(users));
  }
};

// 게시글 관련 서비스
const postService = {
  // 기존 코드 유지...
  // 모든 게시글 가져오기 (최신순 정렬)
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

  // 게시글 생성 (ID 자동 생성)
  createPost: (post) => {
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

  // 게시글 수정
  updatePost: (postId, userId, updatedData) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex((post) => post.id === parseInt(postId));

    if (index === -1) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    // 게시글 작성자 확인
    if (posts[index].authorId !== userId) {
      throw new Error("본인이 작성한 게시글만 수정할 수 있습니다.");
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

  // 게시글 삭제
  deletePost: (postId, userId) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex((post) => post.id === parseInt(postId));

    if (index === -1) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    // 게시글 작성자 확인
    if (posts[index].authorId !== userId) {
      throw new Error("본인이 작성한 게시글만 삭제할 수 있습니다.");
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

// 스터디 관련 서비스
const studyService = {
  // 인기 스터디 가져오기
  getPopularStudies: () => {
    return JSON.parse(localStorage.getItem("popularStudies")) || [];
  },

  // 신규 스터디 가져오기
  getNewStudies: () => {
    return JSON.parse(localStorage.getItem("newStudies")) || [];
  },
};

// 사용자 인증 관련 서비스
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
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // 비밀번호 정보 제외하고 반환
    const { password, ...userInfo } = newUser;
    return userInfo;
  },

  // 현재 로그인한 사용자 정보 가져오기 (프론트엔드에서 활용)
  getCurrentUser: () => {
    const userJson = localStorage.getItem("currentUser");
    return userJson ? JSON.parse(userJson) : null;
  },
};

// 검색 통합 서비스
const searchService = {
  search: (query) => {
    // 게시글 검색
    const postResults = postService.searchPosts(query);

    return {
      posts: postResults,
      // 필요한 경우 다른 검색 결과 추가
    };
  },
};

// 로컬 스토리지 초기화
initializeStorage();

export { postService, studyService, authService, searchService };
