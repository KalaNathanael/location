import { RouteObject } from "react-router-dom";
import { routePaths } from "../config";

export const publicRoutes: RouteObject[] = [
  {
    path: routePaths.root,
    element: <div>Root</div>,
  },
];
