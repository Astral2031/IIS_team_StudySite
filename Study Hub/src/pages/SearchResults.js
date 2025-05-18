// src/pages/SearchResults.js - 오류 수정 버전
import { searchService } from "../services/storageService";

import { Link, useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  // 초기 상태 수정 - studies는 빈 배열로 초기화
  const [results, setResults] = useState({
    posts: [],
    studies: [],
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        if (query) {
          // searchService.search 결과가 studies 필드를 포함하지 않는 문제 해결
          const searchResults = searchService.search(query);

          // studies 필드가 없으면 빈 배열 기본값 설정
          setResults({
            posts: searchResults.posts || [],
            studies: searchResults.studies || [],
          });
        } else {
          setResults({ posts: [], studies: [] });
        }
      } catch (error) {
        console.error("검색 중 오류가 발생했습니다:", error);
        // 오류 발생 시에도 적절한 상태 설정
        setResults({ posts: [], studies: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const getCategoryName = (category) => {
    switch (category) {
      case "notice":
        return "공지사항";
      case "freetalk":
        return "자유게시판";
      case "qna":
        return "Q&A";
      default:
        return category;
    }
  };

  // 안전하게 length 체크
  const hasStudies = results.studies && results.studies.length > 0;
  const hasPosts = results.posts && results.posts.length > 0;
  const hasResults = hasStudies || hasPosts;

  return (
    <div>
      <h1 className="mb-4">"{query}" 검색 결과</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {!hasResults ? (
            <div className="alert alert-info">
              "{query}"에 대한 검색 결과가 없습니다.
            </div>
          ) : (
            <>
              {/* 스터디 검색 결과 섹션 - 안전하게 체크 */}
              {hasStudies && (
                <section className="mb-5">
                  <h2 className="mb-3">스터디 ({results.studies.length})</h2>
                  <div className="list-group">
                    {results.studies.map((study) => (
                      <Link
                        to={`/study-apply/${study.id}`}
                        className="list-group-item list-group-item-action"
                        key={study.id}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">{study.title}</h5>
                          <small>{study.category}</small>
                        </div>
                        <div className="mt-1">
                          <small>
                            참여자: {study.participants}/{study.maxParticipants}
                          </small>
                          {study.likeCount > 0 && (
                            <small className="ms-2">♥ {study.likeCount}</small>
                          )}
                        </div>
                        {study.description && (
                          <p className="text-truncate mt-2">
                            {study.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                  <div className="text-end mt-2">
                    <Link
                      to="/study-list"
                      className="btn btn-outline-primary btn-sm"
                    >
                      모든 스터디 보기
                    </Link>
                  </div>
                </section>
              )}

              {/* 게시글 검색 결과 섹션 - 안전하게 체크 */}
              {hasPosts && (
                <section>
                  <h2 className="mb-3">게시글 ({results.posts.length})</h2>
                  <div className="list-group">
                    {results.posts.map((post) => (
                      <Link
                        to={`/community/post/${post.id}`}
                        className="list-group-item list-group-item-action"
                        key={post.id}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">{post.title}</h5>
                          <small>{post.createdAt}</small>
                        </div>
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">{post.author}</small>
                          <small className="text-muted">
                            {getCategoryName(post.category)}
                          </small>
                        </div>
                        <div className="mt-2">
                          <p className="text-truncate">
                            {post.content.substring(0, 100)}
                            {post.content.length > 100 ? "..." : ""}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
