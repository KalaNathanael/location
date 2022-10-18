import { routePaths } from "@/config";
import { Navigate, useRoutes } from "react-router-dom";
import { protectedRoutes } from "./protected.routes";

import { publicRoutes } from "./public.routes";

const AppRoutes: React.FC = () => {
  const auth: boolean = true;
  const routes = publicRoutes;

  const commonRoutes = [
    { path: "*", element: <Navigate to={routePaths.root} /> },
    {
      path: routePaths.root,
      element: auth ? (
        <Navigate to={routePaths.home} />
      ) : (
        <Navigate to={routePaths.login} />
      ),
    },
  ];

  const element = useRoutes([
    ...commonRoutes,
    ...routes,
    ...protectedRoutes(true),
  ]);

  return <>{element}</>;
};

export default AppRoutes;
