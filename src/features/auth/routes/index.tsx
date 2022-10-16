import { routePaths } from "@/config";
import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Login.page";

export const AuthRoutes: FC = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="" element={<Navigate to={routePaths.login} />} />
    </Routes>
  );
};
