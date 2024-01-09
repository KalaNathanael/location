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
import PAdminItems from "@/features/Dashboard/pages/Admin/AdminItems/AdminItems.page";
import PAdminArticles from "@/features/Dashboard/pages/Admin/AdminArticles/AdminArticles.page";
import PCollectItems from "@/features/Dashboard/pages/location/CollectItems/CollectItems.page";

const HomeRoutes = {
  path: routePaths.home,
  element: (
    <MainContainer>
      <HomePage />
    </MainContainer>
  ),
};

const adminRoutes = (admin: boolean) => {
  const sharedAdminRoutes = [
    { path: "", element: <PAdmin /> },
    {
      path: routePaths.adminCategories,
      element: <PAdminItems />,
    },
    {
      path: routePaths.adminSubCategories,
      element: <PAdminItems />,
    },
    {
      path: routePaths.adminArticles,
      element: <PAdminArticles />,
    },
  ];
  const protectedAdminRoutes = [
    {
      path: routePaths.adminUsers,
      element: <PAdminUsers />,
    },
  ]

  let childrenRoutes = admin ? [...sharedAdminRoutes, ...protectedAdminRoutes] : [...sharedAdminRoutes];

  return {
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
    children: childrenRoutes
  }
};

export const protectedRoutes = (permitRent: boolean = true, admin: boolean): RouteObject[] => {
  if (permitRent)
    return [
      HomeRoutes,
      adminRoutes(admin),
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
          {
            path: routePaths.locationCollect,
            element: <PCollectItems />,
          },
        ],
      },
    ];
  else return [];
};
