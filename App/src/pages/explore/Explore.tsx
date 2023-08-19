import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import CustomLoader from "../../components/loader/loader";
import { SmallCardFile } from "../../components/smallCardFile/SmallCardFile";
import CustomButton from "../../components/button/CustomButton";
import { useFiles } from "../../providers/files.provider";
import "./Explore.css";
import {
  getAllTagsAvailable,
  getFilesByTag,
} from "../../helpers/callsContractAPI";

export const ExplorePage = () => {
  const { loggedStatus, usersContract, userAddress } = useContext(loginContext);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [arrayOfTags, setArrayOfTags] = useState([]);
  const { files, updateFiles } = useFiles();

  useEffect(() => {
    if (usersContract)
      getAllTagsAvailable(usersContract, userAddress).then((result) => {
        setArrayOfTags(result);
        setLoadingTags(false);
      });
  }, [usersContract]);

  const searchByTag = () => {
    setLoadingFiles(true);
    if (selectedTag.length > 0) {
      getFilesByTag(selectedTag, usersContract, userAddress).then((result) => {
        console.log("country", result);

        updateFiles(result);
        setLoadingFiles(false);
      });
    }
  };
  return (
    <div className="explore-container">
      {loggedStatus ? (
        <h1 className="explore-title">Find other uploaded files:</h1>
      ) : (
        <h1>Tags are loading </h1>
      )}
      <div className="explore-layout">
        {loadingTags ? (
          <CustomLoader size="50px" />
        ) : (
          <div className="explore-tags">
            <CustomButton
              onClick={searchByTag}
              title={"Search"}
              variant="dark"
            />
            {arrayOfTags.map((tag) => (
              <div
                className={`tag-option ${
                  selectedTag === tag ? "selected-tag" : ""
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
        {selectedTag.length > 0 && files[0].fileReference.length > 0 ? (
          <div className="explore-files">
            {loadingFiles ? (
              <CustomLoader size="50px" />
            ) : (
              files.map((pf: any) => (
                <SmallCardFile
                  likes={pf.likes}
                  isEditable={false}
                  fileTitle={pf.fileTitle}
                  fileReference={pf.fileReference}
                  fileSize={pf.fileSize}
                  fileType={pf.fileType}
                  description={pf.description}
                  country={pf.country}
                  ownershipRights={pf.ownershipRights}
                  uploadDate={pf.uploadDate}
                  pastOwners={pf.pastOwners}
                  priceForTransfer={pf.priceForTransfer}
                />
              ))
            )}
          </div>
        ) : (
          <h2>Select a tag from the list and click on Search button.</h2>
        )}
      </div>
      {/* <CustomLoader size="50px" /> */}
    </div>
  );
};
