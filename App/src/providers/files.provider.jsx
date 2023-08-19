import React, { createContext, useContext, useState } from "react";

export const FilesContext = createContext();

const FilesProvider = (props) => {
  const [files, setFiles] = useState([
    {
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
    },
  ]);
  const [personalFiles, setPersonalFiles] = useState([
    {
      fileId: 0,
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
    },
  ]);

  const updateFiles = (newFiles) => {
    setFiles(newFiles);
  };
  const updatePersonalFiles = (newFiles) => {
    setPersonalFiles(newFiles);
  };

  return (
    <FilesContext.Provider
      value={{ files, updateFiles, personalFiles, updatePersonalFiles }}
    >
      {props.children}
    </FilesContext.Provider>
  );
};

const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
};

export { FilesProvider, useFiles };
