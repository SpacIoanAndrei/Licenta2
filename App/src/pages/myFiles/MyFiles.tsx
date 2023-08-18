import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import CustomLoader from "../../components/loader/loader";
import { SmallCardFile } from "../../components/smallCardFile/SmallCardFile";
import { useFiles } from "../../providers/files.provider";
import { getPersonalFiles } from "../../helpers/callsContractAPI";
import "./MyFiles.css";

export const MyFilesPage = () => {
  const { loggedStatus, usersContract, userAddress } = useContext(loginContext);
  const { personalFiles, updatePersonalFiles } = useFiles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPersonalFiles(usersContract, userAddress).then((result) => {
      updatePersonalFiles(result);
      setLoading(false);
    });
  }, []);

  return (
    <div className="myfiles-container">
      {loggedStatus && <h1 className="explore-title">My files </h1>}
      {!loading ? (
        <div className="myfiles-layout">
          {personalFiles.map((pf: any) => (
            <SmallCardFile
              likes={pf.likes}
              isEditable={true}
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
          ))}
        </div>
      ) : (
        <CustomLoader size="100px" />
      )}
    </div>
  );
};
