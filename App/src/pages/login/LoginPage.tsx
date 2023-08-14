import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/button/CustomButton";
import { isMetaMask } from "../../helpers/login";
import "./LoginPage.css";

export const LoginPage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedStatus) navigate("/explore");
  }, [loggedStatus]);
  return (
    <div className="login-container">
      {isMetaMask() ? (
        <>
          <h1 className="parag-text">
            Please open MetaMask and log in to connect your wallet.
          </h1>
        </>
      ) : (
        <div className="metamask-footer">
          <h1 className="parag-text">
            Install metamask to create an account and start sharing your
            brilliance!
          </h1>
          <CustomButton
            variant="dark"
            onClick={() => {
              window.location.href = "https://metamask.io/download/";
            }}
            title={"Install MetaMask"}
          />
        </div>
      )}
    </div>
  );
};
