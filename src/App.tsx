import { Helmet } from "react-helmet-async";
import { AppProvider } from "./providers/app.provider";
import AppRoutes from "./routes";
import GloablStyle from "./theme";

const App: React.FC = () => {
  return (
    <AppProvider>
      <GloablStyle />
      <Helmet>
        <title>Location</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/*
          // @ts-ignore */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        {/* Fonts you want to use */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
