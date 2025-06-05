import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import Files from './pages/Files';
import Navbar from './components/Navbar';
import styled from 'styled-components';
import Profile from './pages/Profile';

// Import new forum pages
import ForumHome from './pages/ForumHome';
import SubjectForum from './pages/SubjectForum';
// Import QuestionDetail once created
import QuestionDetail from './pages/QuestionDetail';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  color: #ffffff;
`;

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Home />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects"
        element={
          <ProtectedRoute>
            <Subjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <Files />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Files />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Forum Routes */}
      <Route
        path="/forum"
        element={
          <ProtectedRoute>
             <>
              <Navbar /> {/* Assuming Navbar is needed on Forum pages */}
              <ForumHome />
            </>
          </ProtectedRoute>
        }
      />
       <Route
        path="/forum/subject/:subjectId"
        element={
          <ProtectedRoute>
             <>
              <Navbar /> {/* Assuming Navbar is needed on Forum pages */}
              <SubjectForum />
            </>
          </ProtectedRoute>
        }
      />
       {/* Question Detail Route - add element={<QuestionDetail />} when created */}
       <Route
        path="/forum/question/:questionId"
        element={<ProtectedRoute> <><Navbar /><QuestionDetail /></></ProtectedRoute>}
      />

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <AppRoutes />
        </AppContainer>
      </Router>
    </AuthProvider>
  );
};

export default App; 