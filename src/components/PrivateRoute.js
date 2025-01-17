import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const savedUser = JSON.parse(localStorage.getItem("user"));

  // If no token, redirect to login
  if (!savedUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
