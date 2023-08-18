import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import CustomLoader from "../../components/loader/loader";
import { SmallCardFile } from "../../components/smallCardFile/SmallCardFile";
import CustomButton from "../../components/button/CustomButton";
import { useFiles } from "../../providers/files.provider";
import { getPersonalFiles } from "../../helpers/callsContractAPI";

export const MyFilesPage = () => {
  const { loggedStatus, usersContract, userAddress } = useContext(loginContext);

  const { files, updateFiles } = useFiles();

  console.log("files", files);
  useEffect(() => {
    getPersonalFiles(usersContract, userAddress).then((result) => {
      console.log("setFiles", result);
    });
  }, []);

  return (
    <div className="explore-container">
      {loggedStatus ? (
        <h1 className="explore-title">My files </h1>
      ) : (
        <h1>Explore no login</h1>
      )}
      <div className="explore-layout">
        <div className="explore-files">
          <SmallCardFile title={"Title"} author={"Andrei"} likes={12} />
          <SmallCardFile title={"Title"} author={"Andrei"} likes={12} />
          <SmallCardFile title={"Title"} author={"Andrei"} likes={12} />
          <SmallCardFile title={"Title"} author={"Andrei"} likes={12} />
          <SmallCardFile title={"Title"} author={"Andrei"} likes={12} />
          <SmallCardFile title={"Title"} author={"Andrei"} likes={12} />
          <SmallCardFile title={"Title"} author={"Andrei"} likes={12} />
          <SmallCardFile title={"Title"} author={"Andrei"} likes={12} />
          <SmallCardFile title={"Title"} author={"Andrei"} likes={12} />
        </div>
      </div>
      {/* <CustomLoader size="50px" /> */}
    </div>
  );
};
