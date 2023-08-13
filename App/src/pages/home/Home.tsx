import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import { SmallCardFile } from "../../components/smallCardFile/SmallCardFile";
import "./Home.css";

export const HomePage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);

  return (
    <div className="home-container">
      {loggedStatus ? (
        <h1>Home</h1>
      ) : (
        <h1>Whereas disregard and contempt for human rights have resulted</h1>
      )}
      <SmallCardFile title={"Title"} author={"Andrei"} likes={12} />
    </div>
  );
};
