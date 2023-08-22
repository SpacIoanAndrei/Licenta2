import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginContext } from "../../providers/login/login.provider";
import "./Navbar.css";
import { getRoleForCurrent } from "../../helpers/callsContractAPI";

const Navbar = () => {
  const { loggedStatus, userRole, userAddress } = useContext(loginContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   getRoleForCurrent(usersContract, userAddress).then((result) => {
  //     setRoleForUser(result);
  //   });
  // }, []);

  return (
    <div className="header">
      <div className="leftSection">
        <NavLink className="navlink" to="/">
          FileVault
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
            {/* <NavLink className="navlink" to="/editFile">
              Edit file
            </NavLink> */}
            <NavLink className="navlink" to="/upload">
              Upload
            </NavLink>
            {userRole == 3 && (
              <>
                <NavLink className="navlink" to="/administrative">
                  Accounts Control Panel
                </NavLink>
                {/* <NavLink className="navlink" to="/stats">
                  Statistics
                </NavLink> */}
              </>
            )}
          </>
        )}
      </div>
      {!loggedStatus ? (
        <div className="navlink" onClick={() => navigate("/login")}>
          LOG IN
        </div>
      ) : (
        <div className="adress-wrapper-header">
          <div>Connected wallet: </div>
          <div>{userAddress}</div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
