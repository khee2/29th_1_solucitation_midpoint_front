import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectIfLoggedIn = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RedirectIfLoggedIn;