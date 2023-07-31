import React, { useContext } from "react";
import { loginContext } from "../../providers/login/login.provider";

import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);
  let auth = localStorage.getItem("currentRole"); //use login provider, easy no props, all seems good
  console.log("auth", loggedStatus);
  return loggedStatus ? <Outlet /> : <Navigate to="/login"></Navigate>;
};
