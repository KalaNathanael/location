import * as React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { CustomProvider } from "rsuite";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/fr";

import { persistor, store } from "../store";
import { theme } from "../theme";

const ErrorFallback = () => {
  return (
    <div
      className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
    </div>
  );
};

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          Loading...
        </div>
      }
    >
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <HelmetProvider>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"fr"}
            >
              <Provider store={store}>
                <ThemeProvider theme={theme}>
                  <CustomProvider theme="light">
                    <Router>{children}</Router>
                  </CustomProvider>
                </ThemeProvider>
              </Provider>
            </LocalizationProvider>
          </HelmetProvider>
        </ErrorBoundary>
      </PersistGate>
    </React.Suspense>
  );
};
