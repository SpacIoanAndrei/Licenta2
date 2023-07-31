import React from "react";
import "./CustomButton.css";

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  variant?: "light" | "dark";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const CustomButton: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  title,
  variant = "light",
  ...props
}) => {
  const buttonClasses = `custom-button ${variant} ${
    disabled ? " disabled" : ""
  }`;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {title}
    </button>
  );
};

export default CustomButton;
