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
      {loggedStatus && (
        <h1 className="explore-title">
          My files uploaded on blockchain and IPFS:{" "}
        </h1>
      )}
      {!loading ? (
        <div className="myfiles-layout">
          {personalFiles.map((pf: any) => (
            <SmallCardFile
              fileId={pf.fileId}
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
          {personalFiles.length == 0 && (
            <>
              <h2>You have no uploaded files. </h2>
              <h3>
                Go to upload page to add a new file to IPFS and link it to your
                account.
              </h3>
            </>
          )}
        </div>
      ) : (
        <CustomLoader size="100px" />
      )}
    </div>
  );
};
