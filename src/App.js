// src/App.js
import { AuthProvider } from "./contexts/AuthContext";
import CreatePost from "./pages/CreatePost";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import PostList from "./pages/PostList";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchResults from "./pages/SearchResults";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import StudyList from "./pages/StudyList";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Header />
          <main className="container flex-grow-1 py-4">
            <Routes>
              {/* 공개 라우트 */}
              <Route path="/" element={<Home />} />
              <Route path="/list" element={<StudyList />} />
              <Route path="/community/:category" element={<PostList />} />
              <Route path="/community/post/:id" element={<PostDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* 보호된 라우트 */}
              <Route
                path="/community/create/:category"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />

              {/* 404 페이지 */}
              <Route
                path="*"
                element={
                  <div className="text-center mt-5">
                    <h1>404 - 페이지를 찾을 수 없습니다</h1>
                    <p>요청하신 페이지가 존재하지 않습니다.</p>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
