import React, { useContext } from "react";
import { loginContext } from "../../providers/login/login.provider";

import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);
  let auth = localStorage.getItem("currentRole");
  console.log("auth", loggedStatus);
  return loggedStatus ? <Outlet /> : <Navigate to="/login"></Navigate>;
};

export const AdminRoutes = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);
  let isAdmin = true;
  console.log("isAdmin", isAdmin);
  return isAdmin ? <Outlet /> : <Navigate to="/login"></Navigate>;
};
