// src/pages/SearchResults.js
import { searchService } from "../services/storageService";

import { Link, useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({
    posts: [],
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        if (query) {
          const searchResults = searchService.search(query);
          setResults(searchResults);
        } else {
          setResults({ posts: [] });
        }
      } catch (error) {
        console.error("검색 중 오류가 발생했습니다:", error);
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
          {results.posts.length === 0 ? (
            <div className="alert alert-info">
              "{query}"에 대한 검색 결과가 없습니다.
            </div>
          ) : (
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
    </div>
  );
};

export default SearchResults;
