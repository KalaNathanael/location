import { useRoutes } from "react-router-dom";

import { publicRoutes } from "./public.routes";

const AppRoutes: React.FC = () => {
  const routes = publicRoutes;

  const element = useRoutes([...routes]);

  return <>{element}</>;
};

export default AppRoutes;
