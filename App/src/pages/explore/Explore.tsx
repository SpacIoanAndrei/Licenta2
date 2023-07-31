import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";

export const ExplorePage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);

  return <>{loggedStatus ? <h1>Explore</h1> : <h1>Explore no login</h1>}</>;
};
