import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { loginContext } from "../../providers/login/login.provider";
import "./Navbar.css";

interface NavbarComponent {
  userName?: string;
  email?: string;
}
interface UserProtoytpe {
  name: string;
  email: string;
}

const Navbar = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);

  let decodedToken: UserProtoytpe;
  const accessToken = localStorage.getItem("access_token");

  return (
    <div className="header">
      <div className="leftSection">
        {loggedStatus && (
          <>
            <NavLink className="navlink" to="/">
              Home
            </NavLink>
            <NavLink className="navlink" to="/explore">
              Explore
            </NavLink>
            <NavLink className="navlink" to="/profile">
              Profile
            </NavLink>
            <NavLink className="navlink" to="/upload">
              Upload
            </NavLink>
            <NavLink className="navlink" to="/stats">
              Statistics
            </NavLink>
          </>
        )}
      </div>
      {loggedStatus ? (
        <div className="navlink" onClick={handleLogout}>
          LOG OUT
        </div>
      ) : (
        <div className="navlink" onClick={handleLogin}>
          LOG IN
        </div>
      )}
    </div>
  );
};

export default Navbar;
