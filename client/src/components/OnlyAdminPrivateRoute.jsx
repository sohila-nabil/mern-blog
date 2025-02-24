import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const OnlyAdminPrivateRoute = () => {
  const user = useSelector((state) => state.user.currentUser.data);
  return user && user.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in">Sign in</Navigate>
  );
};

export default OnlyAdminPrivateRoute;
