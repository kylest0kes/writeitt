import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext'; 

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { authToken } = useAuth(); 

  return authToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
