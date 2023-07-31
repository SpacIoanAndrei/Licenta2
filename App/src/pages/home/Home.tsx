import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";

export const HomePage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);

  return <>{loggedStatus ? <h1>Home</h1> : <h1>Home no login</h1>}</>;
};
