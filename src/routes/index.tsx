import { useRoutes } from "react-router-dom";
import { protectedRoutes } from "./protected.routes";

import { publicRoutes } from "./public.routes";

const AppRoutes: React.FC = () => {
  const routes = publicRoutes;

  const element = useRoutes([...routes, ...protectedRoutes(true)]);

  return <>{element}</>;
};

export default AppRoutes;
