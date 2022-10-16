import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";
import GloablStyle from "./GlobalStyle.styles";

const testTheme = createTheme({
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
    fontSize: 12,
  },
  palette: {
    primary: {
      main: "#D59D22",
    },
    secondary: {
      main: "#6750A4",
    },
  },
  zIndex: {
    modal: 1000,
  },
});

export const theme = {
  colors,
  ...testTheme,
};

export default GloablStyle;
