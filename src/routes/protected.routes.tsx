import { Outlet, RouteObject } from "react-router-dom";
import MainContainer from "@/components/containers/Main/Main.container";
import DashboardHeader from "@/features/Dashboard/components/layouts/DashboardHeader/DashboardHeader.layout";
import HomePage from "@/features/Dashboard/pages/Home/Home.page";
import { routePaths } from "@/config";
import PLocationDateTime from "@/features/Dashboard/pages/location/LocationDateTime/LocationDateTime.page";
import PItemList from "@/features/Dashboard/pages/location/ItemsList/ItemsList.page";
import PSubItem from "@/features/Dashboard/pages/location/SubItem/SubItem.page";
import PLocation from "@/features/Dashboard/pages/location/Location.page";

export const protectedRoutes = (permitRent: boolean = true): RouteObject[] => {
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
      ],
    },
  ];
};
