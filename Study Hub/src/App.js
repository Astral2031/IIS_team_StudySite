import { AuthProvider } from "./contexts/AuthContext.js";
import CreatePost from "./pages/CreatePost.js";
import Footer from "./components/Footer.js";
import Header from "./components/Header.js";
import Home from "./pages/Home.js";
import MyStudies from "./pages/MyStudies.js";
import PostDetail from "./pages/PostDetail.js";
import PostList from "./pages/PostList.js";
import PostStudy from "./pages/PostStudy.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import SearchResults from "./pages/SearchResults.js";
import SignIn from "./pages/SignIn.js";
import SignUp from "./pages/SignUp.js";
import StudyApply from "./pages/StudyApply.js";
import StudyList from "./pages/StudyList.js";
import ProfileSettingsPage from "./pages/ProfileSettingsPage.js";
import CommunityPage from "./pages/CommunityPage.js";
import StudyManagementPage from "./pages/StudyManagementPage.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
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
              <Route path="/study-list" element={<StudyList />} />
              <Route path="/study-apply/:id" element={<StudyApply />} />
              <Route path="/community/:category" element={<PostList />} />
              <Route path="/community/:category/post/:id" element={<PostDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile-settings" element={<ProfileSettingsPage />} /> {/* ✅ 계정설정 라우트 추가 */}

              {/* 보호된 라우트 */}
              <Route
                path="/post-study"
                element={
                  <ProtectedRoute>
                    <PostStudy />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-studies"
                element={
                  <ProtectedRoute>
                    <MyStudies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community/create/:category"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-community"
                element={
                  <ProtectedRoute>
                    <CommunityPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-applicants"
                element={
                  <ProtectedRoute>
                    <StudyManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* 레거시 라우트 */}
              <Route path="/list" element={<StudyList />} />

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
