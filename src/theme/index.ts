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
      main: "hsla(77, 72%, 44%, 1)",
    },
    secondary: {
      main: "hsla(177, 100%, 32%, 1)",
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
