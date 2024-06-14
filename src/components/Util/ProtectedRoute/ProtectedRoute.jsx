import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useUser from '../../../modules/hooks/useUser';

function ProtectedRoute({ element, children }) {
  const user = useUser();
  const loading = useSelector((state) => state.loading);

  // if (loading === true) {
  //   return <div>Loading...</div>;
  // }

  if (!user.id ) {
    return <Navigate to="/login" replace />;
  }

  return element || children;
}

export default ProtectedRoute;
