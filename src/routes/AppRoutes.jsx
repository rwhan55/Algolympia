import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Main App Pages
import DashboardPage from '../pages/DashboardPage';
import ResumeUploadPage from '../pages/ResumeUploadPage';
import InterviewFlowPage from '../pages/InterviewFlowPage';
import FinalReportPage from '../pages/FinalReportPage';
import InterviewHistoryPage from '../pages/InterviewHistoryPage';
import ProfilePage from '../pages/ProfilePage';
import CodingPlaygroundPage from '../pages/CodingPlaygroundPage';
import CareerPlanPage from '../pages/CareerPlanPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes inside MainLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/career-plan"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CareerPlanPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-upload"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ResumeUploadPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <MainLayout>
              <InterviewFlowPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/coding-playground"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CodingPlaygroundPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/report/:reportId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FinalReportPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <MainLayout>
              <InterviewHistoryPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Redirection & 404 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
