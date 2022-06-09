import { RouteObject } from "react-router-dom";
import { routePaths } from "../config";
import { DumbPage } from "../features/dumb";

export const publicRoutes: RouteObject[] = [
  {
    path: routePaths.root,
    element: <DumbPage />,
  },
];
