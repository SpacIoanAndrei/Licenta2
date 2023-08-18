import React, { createContext, useContext, useState } from "react";

export const CurrentUserContext = createContext();

const CurrentUserProvider = (props) => {
  const [currentUser, setCurrentUser] = useState({
    userEmail: "",
    dateOfRegistration: 0,
    firstName: "",
    lastName: "",
    country: "",
    description: "",
    allowedUploads: 0,
    index: -1,
    verifyStatus: 0,
    uploadingInProgess: false,
  });
  const updateCurrentUser = (newUserData) => {
    setCurrentUser((prevUser) => ({ ...prevUser, ...newUserData }));
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, updateCurrentUser }}>
      {props.children}
    </CurrentUserContext.Provider>
  );
};

const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return context;
};

export { CurrentUserProvider, useCurrentUser };
