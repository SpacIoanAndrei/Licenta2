import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/button/CustomButton";

export const LoginPage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);
  const navigate = useNavigate();
  return (
    <>
      {loggedStatus ? (
        <>
          <h1 className="p-10">metamask is connected</h1>
          <CustomButton
            onClick={() => navigate("/upload")}
            title={"UPLOAD PAGE"}
          />
        </>
      ) : (
        <>
          <h1>login page</h1>
          <CustomButton
            onClick={() => navigate("/upload")}
            title={"UPLOAD PAGE"}
          />
        </>
      )}
    </>
  );
};
