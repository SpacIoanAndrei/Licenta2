import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";

export const StatsPage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);

  return <>{loggedStatus ? <h1>Stats</h1> : <h1>Stats no login</h1>}</>;
};
