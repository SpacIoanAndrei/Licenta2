import React from "react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../../pages/login/LoginPage";

const AppRoutes = () => {
  return (
    <div className="main">
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
