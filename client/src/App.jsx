import React, { Suspense, lazy } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ExploreJobs = lazy(() => import('./pages/student/ExploreJobs'));
const MyApplications = lazy(() => import('./pages/student/MyApplications'));
const Profile = lazy(() => import('./pages/student/Profile'));
const MockInterview = lazy(() => import('./pages/student/MockInterview'));

const AdminApplicants = lazy(() => import('./pages/admin/Applicants'));
const AdminManageJobs = lazy(() => import('./pages/admin/ManageJobs'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const RouterComponent = import.meta.env.VITE_USE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter;

function App() {
  const { user } = useAuth();

  return (
    <RouterComponent>
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-primary font-medium text-lg">Loading App...</div>}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={
              user?.role === 'admin' ? <Navigate to="/admin/analytics" /> : <Navigate to="/jobs" />
            } />
            
            {/* Student Routes */}
            <Route path="jobs" element={<ProtectedRoute allowedRoles={['student']}><ExploreJobs /></ProtectedRoute>} />
            <Route path="applications" element={<ProtectedRoute allowedRoles={['student']}><MyApplications /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute allowedRoles={['student']}><Profile /></ProtectedRoute>} />
            <Route path="mock-interview" element={<ProtectedRoute allowedRoles={['student']}><MockInterview /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="admin/applicants" element={<ProtectedRoute allowedRoles={['admin']}><AdminApplicants /></ProtectedRoute>} />
            <Route path="admin/jobs" element={<ProtectedRoute allowedRoles={['admin']}><AdminManageJobs /></ProtectedRoute>} />
            <Route path="admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
