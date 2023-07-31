import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";

export const MyProfilePage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);

  return <>{loggedStatus ? <h1>MyProfile</h1> : <h1>MyProfile no login</h1>}</>;
};
