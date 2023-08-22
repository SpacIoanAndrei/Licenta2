import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import CustomLoader from "../../components/loader/loader";
import CustomButton from "../../components/button/CustomButton";
import {
  addAdminLevel,
  addReadLevel,
  addWriteLevel,
  changeUserByAdmin,
  deleteAdminLevel,
  deleteReadLevel,
  deleteWriteLevel,
  getRoleForCurrent,
  getUserProfileByIndex,
  getUsersCount,
} from "../../helpers/callsContractAPI";
import {
  getRoleNameForString,
  getVerificationStatusSString,
} from "../../helpers/manipulation";
import "./AdministrativePage.css";

export const AdministrativePage = () => {
  const { loggedStatus, usersContract, userAddress } = useContext(loginContext);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userIndex, setUserIndex] = useState(0);
  const [nrAllowedUP, setNrAllowedUP] = useState(-1);
  const [roleForUser, setRoleForUser] = useState(-1);
  const [displayedUser, setDisplayedUser] = useState({
    userEmail: "",
    dateOfRegistration: 0,
    firstName: "",
    lastName: "",
    country: "",
    description: "",
    allowedUploads: 0,
    index: -1,
    verifyStatus: "-1",
    uploadingInProgess: false,
    resultAddress: "",
  });

  useEffect(() => {
    getUsersCount(usersContract).then((result) => {
      sessionStorage.setItem("usersCount", result);
    });
  }, []);

  useEffect(() => {
    setLoadingUsers(true);
    const limit = sessionStorage.getItem("usersCount");
    if (limit) {
      const numberLimit = parseInt(limit);
      if (userIndex >= 0 && userIndex <= numberLimit) {
        getUserProfileByIndex(userIndex, usersContract).then(
          (resultProfile) => {
            setDisplayedUser(resultProfile);
            getRoleForCurrent(usersContract, resultProfile.resultAddress).then(
              (result) => {
                setRoleForUser(result);
              }
            );

            setLoadingUsers(false);
            console.log("display user: ", resultProfile);
          }
        );
      } else setLoadingUsers(false);
    }
  }, [userIndex]);

  console.log("roleForUser: ", roleForUser);

  const getUpperLimit = () => {
    const limit = sessionStorage.getItem("usersCount");
    if (limit) {
      const numberLimit = parseInt(limit);
      return numberLimit - 1 > userIndex;
    }
    return false;
  };

  const hanfleNrAllowedUP = (e: any) => {
    setNrAllowedUP(e.target.value);
  };

  const handleChangeUserByAdmin = () => {
    setLoadingUsers(true);
    const payload = {
      userAddress: displayedUser.resultAddress,
      allowedUploads:
        nrAllowedUP === -1 ? displayedUser.allowedUploads : nrAllowedUP,
      verifyStatus: 2,
    };
    changeUserByAdmin(payload, usersContract, userAddress).then(() => {
      setDisplayedUser({
        ...displayedUser,
        verifyStatus: "2",
        allowedUploads:
          nrAllowedUP === -1 ? displayedUser.allowedUploads : nrAllowedUP,
      });
      setLoadingUsers(false);
    });
  };

  const handleAddAdmin = () => {
    setLoadingUsers(true);
    addAdminLevel(displayedUser.resultAddress, usersContract, userAddress).then(
      (result) => {
        if (result) setLoadingUsers(false);
        setUserIndex(userIndex);
      }
    );
  };

  const handleWriteAdmin = () => {
    setLoadingUsers(true);
    addWriteLevel(displayedUser.resultAddress, usersContract, userAddress).then(
      (result) => {
        if (result) setLoadingUsers(false);
        setUserIndex(userIndex);
      }
    );
  };

  const handleReadAdmin = () => {
    setLoadingUsers(true);
    addReadLevel(displayedUser.resultAddress, usersContract, userAddress).then(
      (result) => {
        if (result) setLoadingUsers(false);
        setUserIndex(userIndex);
      }
    );
  };

  const handleCancelAdmin = () => {
    setLoadingUsers(true);
    deleteAdminLevel(
      displayedUser.resultAddress,
      usersContract,
      userAddress
    ).then((result) => {
      if (result) setLoadingUsers(false);
      setUserIndex(userIndex);
    });
  };
  const handleCancelWrite = () => {
    setLoadingUsers(true);
    deleteWriteLevel(
      displayedUser.resultAddress,
      usersContract,
      userAddress
    ).then((result) => {
      if (result) setLoadingUsers(false);
      setUserIndex(userIndex);
    });
  };
  const handleReadWrite = () => {
    setLoadingUsers(true);
    deleteReadLevel(
      displayedUser.resultAddress,
      usersContract,
      userAddress
    ).then((result) => {
      if (result) setLoadingUsers(false);
      setUserIndex(userIndex);
    });
  };

  return (
    <div className="admin-container">
      <h2>Information about accounts and possible changes</h2>
      <div className="pagination-users">
        <div>
          {userIndex > 0 && (
            <CustomButton
              onClick={() => setUserIndex(userIndex - 1)}
              title={"Previous account"}
            />
          )}
        </div>

        {loadingUsers && <CustomLoader size="50px" />}
        <div>
          {getUpperLimit() && (
            <CustomButton
              onClick={() => setUserIndex(userIndex + 1)}
              title={"Next account"}
            />
          )}
        </div>
      </div>
      <div className="user-details-wrapper">
        <div className="info-line-wrapper">
          <span>User's wallet address:</span>
          <span>{displayedUser.resultAddress}</span>
        </div>
        <div className="info-line-wrapper">
          <span>User's email:</span>
          <span>{displayedUser.userEmail}</span>
        </div>
        <div className="info-line-wrapper">
          <span>User's first name:</span>
          <span>{displayedUser.firstName}</span>
        </div>
        <div className="info-line-wrapper">
          <span>User's last name:</span>
          <span>{displayedUser.lastName}</span>
        </div>
        <div className="info-line-wrapper">
          <span>User's account description:</span>
          <span>{displayedUser.description}</span>
        </div>
      </div>

      <div className="actions-admin-wrapper">
        <h2>Status settings</h2>
        <div className="status-wrapper">
          <div className="status-line-1">
            <span>Current status:</span>
            <span>
              {getVerificationStatusSString(displayedUser.verifyStatus)}
            </span>
            {/* {displayedUser.verifyStatus == "1" && ( */}
            <CustomButton
              onClick={handleChangeUserByAdmin}
              title={"Set status to Verified"}
              disabled={displayedUser.verifyStatus != "1"}
            />
            {/* )} */}
          </div>
          {/* {displayedUser.verifyStatus == "1" && ( */}
          <div className="status-line-2">
            <div>Number of allowed uploads: {displayedUser.allowedUploads}</div>
            <span>Change number to: &nbsp; &nbsp; &nbsp; &nbsp; </span>
            <input
              style={{
                height: "38px",
                padding: "6px 12px",
                border: "1px solid #ced4da",
                borderRadius: "0.25rem",
              }}
              type="number"
              onChange={hanfleNrAllowedUP}
              disabled={displayedUser.verifyStatus != "1"}
            />
          </div>
          {/* )} */}
        </div>
        <h2>Roles settings</h2>
        <div className="roles-wrapper">
          <div className="admin-buttons-container">
            <span>
              Current permission level: {getRoleNameForString(roleForUser)}
            </span>
            {roleForUser == 3 && (
              <CustomButton
                onClick={handleCancelAdmin}
                title={"Cancel Admin"}
              />
            )}
            {roleForUser == 2 && (
              <>
                <CustomButton
                  onClick={() => {
                    handleCancelWrite();
                    handleReadWrite();
                  }}
                  title={"Deny Write and Read"}
                />
                <CustomButton
                  onClick={handleCancelWrite}
                  title={"Deny Write"}
                />
                <CustomButton onClick={handleAddAdmin} title={"Make Admin"} />
              </>
            )}
            {roleForUser == 1 && (
              <>
                <CustomButton
                  onClick={handleWriteAdmin}
                  title={"Allow Write"}
                />
              </>
            )}
            {roleForUser == 0 && (
              <>
                <CustomButton onClick={handleReadAdmin} title={"Allow Read"} />
                <CustomButton
                  onClick={() => {
                    handleReadAdmin();
                    handleWriteAdmin();
                  }}
                  title={"Allow Read and Write"}
                />
              </>
            )}
          </div>
          <div className="legend-container">
            <ul>
              <li>
                Read: This allows the users to see their account information as
                well as the files they uploaded. They can not upload new data,
                make chenges to their account details or uploaded files.
              </li>
              <li>
                Write: This permission level contains all the action from Read,
                and more: users can modify any personal data and can perform any
                action related to files.{" "}
              </li>
              <li>
                Administrator: They can increase or decrease the limit of
                uploads for each account. They can change permission levels for
                other accounts, apart of the owner. Includes Read and Write
                permission.
              </li>
              <li>
                Banned: the user is banned from the platform and can not
                interact with any feature or personal data.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
