import React from "react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../../pages/login/LoginPage";
import { HomePage } from "../../pages/home/Home";
import { ExplorePage } from "../../pages/explore/Explore";
import { MyProfilePage } from "../../pages/myProfile/MyProfile";
import { UploadPage } from "../../pages/upload/Upload";
import { StatsPage } from "../../pages/stats/Stats";
import { MyFilesPage } from "../../pages/myFiles/MyFiles";
import { EditFilePage } from "../../pages/editFile/EditFile";
import { AdminRoutes, ProtectedRoute } from "./ProtectedRoute";
import Navbar from "../navbar/Navbar";

const styles = {
  fontFamily: '"Open Sans", Arial, sans-serif',
};

const AppRoutes = () => {
  return (
    <div className="main" style={styles}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/myFiles" element={<MyFilesPage />} />
          <Route path="/editFile" element={<EditFilePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/transfer" element={<UploadPage />} />
          <Route element={<AdminRoutes />}>
            <Route path="/verify" element={<UploadPage />} />
            <Route path="/roles" element={<UploadPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
