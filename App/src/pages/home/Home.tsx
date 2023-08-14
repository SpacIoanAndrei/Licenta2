import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginContext } from "../../providers/login/login.provider";
import lightBulb from "../../helpers/images/ideaBulb.png";
import CustomButton from "../../components/button/CustomButton";
import "./Home.css";

export const HomePage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <h1 className="title-area">Welcome to FileVault</h1>
      <h1 className="title-area">
        The hub of intellectual property sharing and innovation!
      </h1>
      <div className="bulb-container">
        <img
          className="image-div"
          src={lightBulb}
          alt="light bulb idea"
          width={350}
          height={350}
        />
        <div className="bulb-text-container">
          <h3 className="parag-text">
            Are you an inventor, artist, or visionary? Experience the future of
            innovation as you securely share your patents, captivating images,
            and valuable intellectual property with the world, all stored on the
            immutable Ethereum blockchain.
          </h3>
          <h3 className="parag-text">
            By harnessing the power of the Ethereum blockchain, your creations
            are not only shared but are also stored in an unalterable ledger,
            ensuring the integrity and authenticity of your work for generations
            to come.
          </h3>
        </div>
      </div>
      <h2 className="parag-text">
        Collaborate, connect, and create with a community of like-minded
        individuals who share your passion for pushing the boundaries of
        creativity and knowledge.
      </h2>
      {!loggedStatus && (
        <div className="metamask-footer">
          <h1 className="parag-text">Log in to have access to all features!</h1>
          <CustomButton
            variant="dark"
            onClick={() => navigate("/login")}
            title={"Log in"}
          />
        </div>
      )}
      {/* <SmallCardFile title={"Title"} author={"Andrei"} likes={12} /> */}
    </div>
  );
};
