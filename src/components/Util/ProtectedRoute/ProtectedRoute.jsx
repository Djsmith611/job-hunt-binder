import React from 'react';
import { Navigate } from 'react-router-dom';
import useUser from '../../modules/hooks/useUser';

function ProtectedRoute({ element, children }) {
  const user = useUser();

  if (!user.id) {
    return <Navigate to="/login" replace />;
  }

  return element || children;
}

export default ProtectedRoute;