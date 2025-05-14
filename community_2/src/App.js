import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // 추가
import Header from './components/Header';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import CommunityPage from './pages/CommunityPage';
import MyStudiesPage from './pages/MyStudiesPage';
import StudyManagementPage from './pages/StudyManagementPage';
import StudyListPage from './pages/StudyListPage';
import PostStudyPage from './pages/PostStudyPage';
import StudyApplyPage from './pages/StudyApplyPage';
import Login from './pages/LoginPage'; // 로그인 페이지 추가

function App() {
  return (
    <AuthProvider> {/* 로그인 상태를 앱 전체에서 관리 가능 */}
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} /> {/* 추가 */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile-settings" element={<ProfileSettingsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/my-studies" element={<MyStudiesPage />} />
          <Route path="/study-management" element={<StudyManagementPage />} />
          <Route path="/study-list" element={<StudyListPage />} />
          <Route path="/post-study" element={<PostStudyPage />} />
          <Route path="/study-apply/:id" element={<StudyApplyPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
