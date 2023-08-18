import React, { useContext, useEffect, useState } from "react";
import myImage from "../../bank.png";
import "./SmallCardFile.css";
import {
  convertSizeToMBGB,
  convertTimestampToDate,
  getRightsCategoryString,
} from "../../helpers/manipulation";
import CustomButton from "../button/CustomButton";
import { Link } from "react-router-dom";

interface SmallCardFileProp {
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
  priceForTransfer: [];
}

export const SmallCardFile = ({
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
  priceForTransfer,
}: SmallCardFileProp) => {
  const [isHovered, setIsHovered] = useState(false);
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
          src={myImage}
          alt="presentation for tag"
          onClick={() => window.open("https://ipfs.io/ipfs/" + fileReference)}
        ></img>
      </div>
      <div className="info-container">
        <div className="title">{fileTitle}</div>
        <div className="info-line">
          <span>{convertTimestampToDate(uploadDate)}</span>
          <span>Likes: {likes}</span>
        </div>

        {isHovered && (
          <>
            <div className="description-wrapper">{description}</div>
            <div className="info-line">
              <span>Country: {country}</span>
              <span>{getRightsCategoryString(ownershipRights)}</span>
            </div>
            <div className="info-line">
              <span>{fileType}</span>
              <span>{convertSizeToMBGB(fileSize)}</span>
            </div>
            <div className="info-line">
              <span>
                Price: {priceForTransfer[priceForTransfer.length - 1]}
              </span>
              {isEditable && (
                <Link to={`/editFile?customId=${fileReference}`}>
                  <CustomButton
                    onClick={() => {
                      sessionStorage.setItem("reference", fileReference);
                    }}
                    title={"Edit"}
                  />
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
