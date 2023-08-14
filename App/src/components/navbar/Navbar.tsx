import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginContext } from "../../providers/login/login.provider";
import "./Navbar.css";

const Navbar = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);
  const navigate = useNavigate();

  let isAdmin = true;

  return (
    <div className="header">
      <div className="leftSection">
        <NavLink className="navlink" to="/">
          Home
        </NavLink>
        <NavLink className="navlink" to="/explore">
          Explore
        </NavLink>
        {loggedStatus && (
          <>
            <NavLink className="navlink" to="/profile">
              Profile
            </NavLink>
            <NavLink className="navlink" to="/myFiles">
              My files
            </NavLink>
            <NavLink className="navlink" to="/editFile">
              Edit file
            </NavLink>
            <NavLink className="navlink" to="/upload">
              Upload
            </NavLink>
            <NavLink className="navlink" to="/transfer">
              Transfer
            </NavLink>
            {isAdmin && (
              <>
                <NavLink className="navlink" to="/verify">
                  Verify
                </NavLink>
                <NavLink className="navlink" to="/roles">
                  Roles
                </NavLink>
                <NavLink className="navlink" to="/stats">
                  Statistics
                </NavLink>
              </>
            )}
          </>
        )}
      </div>
      {!loggedStatus && (
        <div className="navlink" onClick={() => navigate("/login")}>
          LOG IN
        </div>
      )}
    </div>
  );
};

export default Navbar;
