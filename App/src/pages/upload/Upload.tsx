import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";

export const UploadPage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);

  return <>{loggedStatus ? <h1>Upload</h1> : <h1>Upload no login</h1>}</>;
};
