import { Outlet, RouteObject } from "react-router-dom";

import MainContainer from "@/components/containers/Main/Main.container";
import DashboardHeader from "@/features/Dashboard/components/layouts/DashboardHeader/DashboardHeader.layout";
import HomePage from "@/features/Dashboard/pages/Home/Home.page";
import PLocationDateTime from "@/features/Dashboard/pages/location/LocationDateTime/LocationDateTime.page";
import PItemList from "@/features/Dashboard/pages/location/ItemsList/ItemsList.page";
import PSubItem from "@/features/Dashboard/pages/location/SubItem/SubItem.page";
import PLocation from "@/features/Dashboard/pages/location/Location.page";
import PLocationDetails from "@/features/Dashboard/pages/location/LocationDetails/LocationDetails.page";

import { routePaths } from "@/config";
import PAdmin from "@/features/Dashboard/pages/Admin/Admin.page";
import PAdminUsers from "@/features/Dashboard/pages/Admin/AdminUsers/AdminUsers.page";

export const protectedRoutes = (permitRent: boolean = true): RouteObject[] => {
  if (permitRent)
    return [
      {
        path: routePaths.home,
        element: (
          <MainContainer>
            <HomePage />
          </MainContainer>
        ),
      },
      {
        path: routePaths.admin,
        element: (
          <>
            <DashboardHeader />
            <MainContainer>
              <div style={{ height: "63.5px" }}></div>
              <Outlet />
            </MainContainer>
          </>
        ),
        children: [
          { path: "", element: <PAdmin /> },
          {
            path: routePaths.adminUsers,
            element: <PAdminUsers />,
          },
          {
            path: routePaths.adminArticles,
            element: <div>Kiffer</div>,
          },
        ],
      },
      {
        path: routePaths.location,
        element: (
          <>
            <DashboardHeader />
            <MainContainer>
              <div style={{ height: "63.5px" }}></div>
              <Outlet />
            </MainContainer>
          </>
        ),
        children: [
          { path: "", element: <PLocation /> },
          {
            path: routePaths.locationDate,
            element: <PLocationDateTime />,
          },
          {
            path: routePaths.locationCategories,
            element: <PItemList />,
          },
          {
            path: routePaths.locationSubCategories,
            element: <PItemList />,
          },
          {
            path: routePaths.locationCategoriesArticles,
            element: <PSubItem />,
          },
          {
            path: routePaths.locationSubCategoriesArticles,
            element: <PSubItem />,
          },
          {
            path: routePaths.locationConfirmCommand,
            element: <PLocationDetails />,
          },
          {
            path: routePaths.locationDetails,
            element: <PLocationDetails />,
          },
        ],
      },
    ];
  else return [];
};
