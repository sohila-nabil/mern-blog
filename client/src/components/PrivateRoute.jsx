import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const PrivateRoute = () => {
  const user = useSelector((state) => state.user.currentUser.data);
  return user ? <Outlet /> : <Navigate to="/sign-in">Sign in</Navigate>;
};

export default PrivateRoute;
