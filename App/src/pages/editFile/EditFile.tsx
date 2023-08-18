import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import CustomLoader from "../../components/loader/loader";
import { SmallCardFile } from "../../components/smallCardFile/SmallCardFile";
import CustomButton from "../../components/button/CustomButton";
import { useFiles } from "../../providers/files.provider";
import { useLocation } from "react-router-dom";
import "./EditFile.css";

export const EditFilePage = () => {
  const { loggedStatus, usersContract } = useContext(loginContext);

  const [selectedFile, setSelectedFile] = useState({
    fileTitle: "",
    fileReference: "",
    fileSize: 0,
    fileType: "",
    description: "",
    country: "",
    ownershipRights: 0,
    uploadDate: 0,
    likes: 0,
    pastOwners: [],
    priceForTransfer: [],
  });
  const [arrayOfTags, setArrayOfTags] = useState(["tech", "photos", "patent"]);
  const { personalFiles, updateFiles } = useFiles();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customString = searchParams.get("customId");

  useEffect(() => {
    const thisFile = personalFiles.find((file: any) => {
      if (
        file.fileReference === customString &&
        file.fileReference === sessionStorage.getItem("reference")
      )
        return file;
    });
    if (thisFile) setSelectedFile(thisFile);
  }, []);

  return (
    <div className="editFile-container">
      {selectedFile.fileReference.length !== 0 ? (
        <div>{selectedFile.fileTitle}</div>
      ) : (
        <h1>Choose the file you want to modify from My files section.</h1>
      )}
    </div>
  );
};
