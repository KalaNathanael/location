import MainContainer from "@/components/containers/Main/Main.container";
import { AuthRoutes } from "@/features/auth";
import { RouteObject } from "react-router-dom";
import { routePaths } from "../config";

export const publicRoutes: RouteObject[] = [
  {
    path: routePaths.auth + "/*",
    element: (
      <MainContainer>
        <AuthRoutes />
      </MainContainer>
    ),
  },
];
