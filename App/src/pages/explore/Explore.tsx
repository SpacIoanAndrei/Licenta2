import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import CustomLoader from "../../components/loader/loader";
import { SmallCardFile } from "../../components/smallCardFile/SmallCardFile";
import CustomButton from "../../components/button/CustomButton";
import { useFiles } from "../../providers/files.provider";
import "./Explore.css";

export const ExplorePage = () => {
  const { loggedStatus, usersContract } = useContext(loginContext);

  const [selectedTag, setSelectedTag] = useState("");
  const [arrayOfTags, setArrayOfTags] = useState(["tech", "photos", "patent"]);
  const { files, updateFiles } = useFiles();

  console.log("files", files);
  const searchByTag = () => {
    console.log("imp sea by tag");
  };
  return (
    <div className="explore-container">
      {loggedStatus ? (
        <h1 className="explore-title">Find uploaded files by others</h1>
      ) : (
        <h1>Explore no login</h1>
      )}
      <div className="explore-layout">
        <div className="explore-tags">
          <CustomButton onClick={searchByTag} title={"Search"} variant="dark" />
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
