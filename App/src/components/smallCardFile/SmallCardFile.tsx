import React, { useContext, useEffect, useState } from "react";
import myImage from "../../bank.png";
import "./SmallCardFile.css";

interface SmallCardFileProp {
  title: string;
  author: string;
  likes: number;
}

export const SmallCardFile = ({ title, author, likes }: SmallCardFileProp) => {
  return (
    <div className="small-card-wrapper">
      <div>
        <img
          className="image-container"
          src={myImage}
          alt="presentation image png"
        ></img>
      </div>
      <div className="info-container">
        <div className="title">{title}</div>
        <div className="info-line">
          <span>{author}</span>
          <span>Likes: {likes}</span>
        </div>
      </div>
    </div>
  );
};
