// src/App.tsx (simplified)
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import AddSurvey from './pages/AddSurvey';
import SurveyPage from './pages/SurveyPage';
import Configure from './pages/ConfigureSurvey';
import InvalidSurvey from './pages/InvalidSurvey';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/invalid-survey" element={<InvalidSurvey />} />
      <Route path="/add-survey" 
        element={
          <ProtectedRoute>
            <AddSurvey />
          </ProtectedRoute>
        } 
      />
      <Route path="/configure" 
        element={
          <ProtectedRoute>
            <Configure />
          </ProtectedRoute>
        } 
      />
      <Route path="/survey/:token" element={<SurveyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}