// src/pages/SearchResults.js
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchService } from "../services/searchService.js";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ posts: [], studies: [] });

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        if (query) {
          const searchResults = await searchService.search(query);
          setResults({
            posts: searchResults.posts || [],
            studies: searchResults.studies || [],
          });
        } else {
          setResults({ posts: [], studies: [] });
        }
      } catch (error) {
        console.error("검색 실패:", error);
        setResults({ posts: [], studies: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const getCategoryName = (category) => {
    switch (category) {
      case "notice": return "공지사항";
      case "free": return "자유게시판";
      case "qna": return "Q&A";
      default: return category;
    }
  };

  const hasStudies = results.studies?.length > 0;
  const hasPosts = results.posts?.length > 0;
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
      ) : !hasResults ? (
        <div className="alert alert-info">
          "{query}"에 대한 검색 결과가 없습니다.
        </div>
      ) : (
        <>
          {hasStudies && (
            <section className="mb-5">
              <h2 className="mb-3">스터디 ({results.studies.length})</h2>
              <div className="list-group">
                {results.studies.map((study) => (
                  <Link
                    key={study.id}
                    to={`/study-apply/${study.id}`}
                    className="list-group-item list-group-item-action"
                  >
                    <h5 className="mb-1">{study.title}</h5>
                    <small>{study.category}</small>
                    <div className="mt-1">
                      {study.likeCount > 0 && (
                        <small className="ms-2">♥ {study.likeCount}</small>
                      )}
                    </div>
                    {study.description && (
                      <p className="text-truncate mt-2">{study.description}</p>
                    )}
                  </Link>
                ))}
              </div>
              <div className="text-end mt-2">
                <Link to="/study-list" className="btn btn-outline-primary btn-sm">
                  모든 스터디 보기
                </Link>
              </div>
            </section>
          )}

          {hasPosts && (
            <section>
              <h2 className="mb-3">게시글 ({results.posts.length})</h2>
              <div className="list-group">
                {results.posts.map((post) => (
                  post.post_type && post.id ? (
                    <Link
                      key={`${post.post_type}-${post.id}`}
                      to={`/${post.post_type}/${post.id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-1">{post.title}</h5>
                        <small>{post.created_at}</small>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">{post.author_id}</small>
                        <small className="text-muted">{getCategoryName(post.post_type)}</small>
                      </div>
                      <p className="text-truncate mt-2">
                        {post.content.slice(0, 100)}{post.content.length > 100 ? "..." : ""}
                      </p>
                    </Link>
                  ) : null
                ))}


              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
