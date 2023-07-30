import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";

export const LoginPage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);

  return (
    <>{loggedStatus ? <h1>metamask is connected</h1> : <h1>login page</h1>}</>
  );
};
