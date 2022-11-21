import { routePaths } from "@/config";
import { selectConnectedUser } from "@/store/reducers/app/app.selector";
import { connect, ConnectedProps } from "react-redux";
import { Navigate, useRoutes } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { protectedRoutes } from "./protected.routes";

import { publicRoutes } from "./public.routes";

type AppRoutesProps = ConnectedProps<typeof connector>;
const AppRoutes: React.FC<AppRoutesProps> = ({ connectedUser }) => {
  const auth: boolean = !!connectedUser;
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
    ...protectedRoutes(auth),
  ]);

  return <>{element}</>;
};

const mapStateToProps = createStructuredSelector({
  connectedUser: selectConnectedUser,
});
const connector = connect(mapStateToProps);

export default connector(AppRoutes);
