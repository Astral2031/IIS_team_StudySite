// src/pages/Home.js
import { postService, studyService } from "../services/storageService";

//   Carousel 컴포넌트 import 추가
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";


const Home = () => {
  const [newStudies, setNewStudies] = useState([]);
  const [popularStudies, setPopularStudies] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 데이터 가져오기
    const fetchData = () => {
      try {
        const newStudiesData = studyService.getNewStudies();
        const popularStudiesData = studyService.getPopularStudies();
        const popularPostsData = postService.getPopularPosts();

        setNewStudies(newStudiesData);
        setPopularStudies(popularStudiesData);
        setPopularPosts(popularPostsData);
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // 날짜가 유효한지 확인
    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("ko-KR");
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 슬라이드 배너 추가 */}
      <Carousel className="mb-5">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/banner1.jpg"
            alt="Study Hub Banner 1"
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>스터디 허브에 오신 것을 환영합니다</h3>
            <p>함께 공부하고 성장할 수 있는 스터디 허브입니다.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/banner2.jpg"
            alt="Study Hub Banner 2"
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>스터디 그룹 모집</h3>
            <p>다양한 분야의 스터디 그룹에 참여하거나 직접 모집해 보세요.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div className="text-center mb-5">
        <h1 className="display-4">스터디 허브에 오신 것을 환영합니다!</h1>
        <p className="lead">함께 공부하고 성장할 수 있는 스터디 허브입니다.</p>
      </div>

      {/* 신규 스터디 그룹 섹션 */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>신규 스터디 그룹</h2>
          <Link to="/list" className="btn btn-outline-primary btn-sm">
            더 보기
          </Link>
        </div>
        <div className="row">
          {newStudies.map((study) => (
            <div className="col-md-4 mb-4" key={study.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{study.title}</h5>
                  <p className="card-text">{study.description}</p>
                  <div className="text-muted small mb-2">
                    <span>
                      인원: {study.memberCount}/{study.maxMembers}
                    </span>
                    <span className="ms-3">
                      생성일: {formatDate(study.createdAt)}
                    </span>
                  </div>
                  <Link
                    to={`/study/${study.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    상세 보기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 인기 스터디 그룹 섹션 */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>인기 스터디 그룹</h2>
          <Link to="/list" className="btn btn-outline-primary btn-sm">
            더 보기
          </Link>
        </div>
        <div className="row">
          {popularStudies.map((study) => (
            <div className="col-md-4 mb-4" key={study.id}>
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title">{study.title}</h5>
                    <span className="badge bg-warning text-dark">
                      ♥ {study.likeCount}
                    </span>
                  </div>
                  <p className="card-text">{study.description}</p>
                  <div className="text-muted small mb-2">
                    <span>
                      인원: {study.memberCount}/{study.maxMembers}
                    </span>
                  </div>
                  <Link
                    to={`/study/${study.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    상세 보기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 인기 커뮤니티 게시글 섹션 */}
      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>인기 게시글</h2>
          <Link
            to="/community/popular"
            className="btn btn-outline-primary btn-sm"
          >
            더 보기
          </Link>
        </div>
        <div className="list-group">
          {popularPosts.map((post) => (
            <Link
              to={`/community/post/${post.id}`}
              className="list-group-item list-group-item-action"
              key={post.id}
            >
              <div className="d-flex w-100 justify-content-between align-items-center">
                <h5 className="mb-1">{post.title}</h5>
                <span className="badge bg-warning text-dark">
                  ♥ {post.likeCount}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">{post.author}</small>
                  <small className="text-muted ms-2">
                    댓글 {post.comments?.length || 0}개
                  </small>
                </div>
                <small className="text-muted">
                  {formatDate(post.createdAt)}
                </small>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
