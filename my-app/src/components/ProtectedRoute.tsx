// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (token) {
  const { exp } = jwtDecode(token) as { exp: number };

  if (Date.now() >= exp * 1000) {
    // Token expired
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}

  return <>{children}</>;
};

export default ProtectedRoute;
