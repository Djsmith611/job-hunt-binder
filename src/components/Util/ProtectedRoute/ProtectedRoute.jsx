import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ element, children }) {
  const user = useSelector((state) => state.user);
  const loading = useSelector((state) => state.loading);

  if (loading === true) {
    return <div>Loading...</div>;
  }

  if (!user.id && loading === false) {
    return <Navigate to="/login" replace />;
  }

  return element || children;
}

export default ProtectedRoute;
