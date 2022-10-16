import MainContainer from "@/components/containers/Main/Main.container";
import { AuthRoutes } from "@/features/auth";
import { Outlet, RouteObject } from "react-router-dom";
import { routePaths } from "../config";
import { DumbPage } from "../features/dumb";

export const publicRoutes: RouteObject[] = [
  {
    path: routePaths.root,
    element: <DumbPage />,
  },
  {
    path: routePaths.auth + "/*",
    element: (
      <MainContainer>
        <AuthRoutes />
      </MainContainer>
    ),
  },
];
