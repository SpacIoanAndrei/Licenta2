import React from "react";
import "./loader.css";
type Props = {
  className?: string;
  size?: any;
};

function CustomLoader({ className, size }: Props) {
  return (
    <div
      className={`${className} flex items-center justify-center`}
      style={{ width: size, height: size }}
    >
      <div className="loader" style={{ width: size, height: size }}></div>
    </div>
  );
}

export default CustomLoader;
