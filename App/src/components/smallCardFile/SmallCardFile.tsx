import React, { useContext, useEffect, useState } from "react";
import SimbolImage from "../../helpers/images/SimbolImage.png";
import UnknownImage from "../../helpers/images/unknown.jpg";
import ZIPImage from "../../helpers/images/SimbolZIP.png";
import PfdImage from "../../helpers/images/SimbolPDF.jpg";

import "./SmallCardFile.css";
import {
  convertSizeToMBGB,
  convertTimestampToDate,
  getPriceInEth,
  getRightsCategoryString,
} from "../../helpers/manipulation";
import CustomButton from "../button/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { loginContext } from "../../providers/login/login.provider";
import { addALike, makeTransfer } from "../../helpers/callsContractAPI";

interface SmallCardFileProp {
  fileId: number;
  isEditable: boolean;
  fileTitle: string;
  fileReference: string;
  fileSize: number;
  fileType: string;
  description: string;
  country: string;
  ownershipRights: number;
  uploadDate: number;
  likes: number;
  pastOwners: [];
  ownerEmail?: "";
  priceForTransfer: [0];
}

export const SmallCardFile = ({
  fileId,
  isEditable,
  fileTitle,
  fileReference,
  fileSize,
  fileType,
  description,
  country,
  ownershipRights,
  uploadDate,
  likes,
  pastOwners,
  ownerEmail,
  priceForTransfer,
}: SmallCardFileProp) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { usersContract, userAddress, sessionWeb3 } = useContext(loginContext);
  const [localLikes, setlocalLikes] = useState(likes);
  const [localPrice, setLocalPrice] = useState();
  const [loadingCard, setLoadingCard] = useState(false);

  useEffect(() => {
    console.log("priceForTransfer ", priceForTransfer);
    if (priceForTransfer[priceForTransfer.length - 1])
      getPriceInEth(
        priceForTransfer[priceForTransfer.length - 1].toString(),
        sessionWeb3
      ).then((result) => setLocalPrice(result));
  }, [priceForTransfer]);
  const addLike = () => {
    const payload = {
      fileId,
      like: 1,
    };
    addALike(payload, usersContract, userAddress).then((result) => {
      console.log("return from like", result);
      setlocalLikes(localLikes + 1);
    });
  };

  const getImage = (fileType: string) => {
    switch (fileType) {
      case "getImage":
        return SimbolImage;
      case "application/pdf":
        return PfdImage;
      case "application/x-zip-compressed":
        return ZIPImage;

      default:
        return UnknownImage;
    }
  };

  const callTransfer = () => {
    setLoadingCard(true);

    if (fileId) {
      const payload = {
        fileId: fileId,
        newUserAddress: userAddress,
        owner: pastOwners[pastOwners.length - 1],
      };
      console.log("payload", payload);
      makeTransfer(payload, usersContract).then(() => {
        setLoadingCard(false);
        navigate("/myFiles");
      });
    }
    setLoadingCard(false);
  };

  return (
    <div
      className="small-card-wrapper"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div>
        <img
          className="image-container"
          src={getImage(fileType)}
          alt="presentation for tag"
          onClick={() => {
            if (ownershipRights != 0 && ownershipRights != 4)
              window.open("https://ipfs.io/ipfs/" + fileReference);
          }}
        ></img>
      </div>
      <div className="info-container">
        <div className="title">{fileTitle}</div>
        {ownershipRights != 0 && (
          <div className="info-line">
            <span>Content Identifier: {fileReference}</span>
          </div>
        )}
        <div className="info-line">
          <span>Price: {localPrice} ETH</span>
          <span>Likes: {localLikes}</span>
        </div>

        {isHovered ? (
          <>
            <div className="description-wrapper">{description}</div>

            <div className="info-line">
              <span>Country: {country}</span>
              <span>Rights: {getRightsCategoryString(ownershipRights)}</span>
            </div>
            {ownerEmail == undefined && (
              <div className="info-line">
                <span>Type:{fileType}</span>
                <span>{convertSizeToMBGB(fileSize)}</span>
              </div>
            )}
            <div className="info-line">
              <span>Upload date: {convertTimestampToDate(uploadDate)}</span>
            </div>
            <div className="info-line">
              <span>Transfers: {pastOwners.length - 1}</span>
            </div>
            <div className="info-line">
              <div>Owner address:</div>
            </div>
            {pastOwners[pastOwners.length - 1]}
            {ownerEmail && (
              <div className="info-line">
                <div>Owner email: {ownerEmail}</div>
              </div>
            )}
            <div className="info-line">
              <div>Chain: Ethereum</div>
            </div>
            <div className="info-line">
              {isEditable ? (
                <Link to={`/editFile?customId=${fileReference}`}>
                  <CustomButton
                    onClick={() => {
                      sessionStorage.setItem("reference", fileReference);
                    }}
                    title={"Edit"}
                  />
                </Link>
              ) : (
                <>
                  <CustomButton onClick={addLike} title={"Like"} />

                  <CustomButton
                    // onClick={() => {
                    //   sessionStorage.setItem("fileTitle", fileTitle);
                    //   sessionStorage.setItem("cid", fileReference);
                    //   sessionStorage.setItem(
                    //     "price",
                    //     priceForTransfer[
                    //       priceForTransfer.length - 1
                    //     ].toString()
                    //   );
                    //   sessionStorage.setItem(
                    //     "owner",
                    //     pastOwners[pastOwners.length - 1]
                    //   );
                    //   sessionStorage.setItem("fileId", fileId.toString());
                    // }}
                    onClick={callTransfer}
                    title={"Transfer"}
                    disabled={
                      ownershipRights != 1 ||
                      pastOwners[pastOwners.length - 1] == userAddress
                    }
                  />
                </>
              )}
            </div>
          </>
        ) : (
          <div className="see-details">See more details</div>
        )}
      </div>
    </div>
  );
};
