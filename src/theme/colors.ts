import { TThemeColors } from "../utils/convertThemeColorsToRootColors";

export const colors: TThemeColors = {
  ui: {
    primary: "hsla(77, 72%, 44%, 1)",
    "primary-rgb": "213, 157, 34",
    secondary: "hsla(177, 100%, 32%, 1)",
    info: "rgba(93, 183, 222, 1)",
    success: "rgba(12, 245, 116, 1)",
    warning: "rgba(250, 155, 47, 1)",
    danger: "rgba(193, 41, 46, 1)",
    red: {
      normal: "rgba(193, 41, 46, 1)",
      lighter: "rgba(193, 41, 46, 0.5)",
      rgb: "193, 41, 46",
      dark: "rgba(140, 30, 34, 1)",
      "rgb-dark": "140, 30, 34",
    },
    blue: {
      normal: "rgba(93, 183, 222, 1)",
      lighter: "rgba(93, 183, 222, 0.5)",
      rgb: "93, 183, 222",
      dark: "rgba(71, 141, 170, 1)",
      "rgb-dark": "71, 141, 170",
    },
    yellow: {
      normal: "rgba(241, 211, 2, 1)",
      rgb: "241, 211, 2",
      lighter: "rgba(241, 211, 2, 0.5)",
      dark: "rgba(188, 163, 1, 1)",
      "rgb-dark": "188, 163, 1",
    },
    orange: {
      normal: "rgba(250, 155, 47, 1)",
      rgb: "250, 155, 47",
      lighter: "rgba(252, 198, 144, 1)",
      dark: "rgba(219, 128, 0, 1)",
      "rgb-dark": "219, 128, 0",
    },
    green: {
      normal: "rgba(12, 245, 116, 1)",
      rgb: "12, 245, 116",
      lighter: "rgba(12, 245, 116, 0.5)",
      dark: "rgba(9, 193, 89, 1)",
      "rgb-dark": "9, 193, 89",
    },
    white: {
      normal: "white",
      lighter: "rgba(255, 255, 255, 0.5)",
    },
    grey: {
      normal: "rgba(158, 158, 158, 1)",
      lighter: "rgba(158, 158, 158, 0.5)",
    },
  },
  text: {
    primary: "hsla(225, 29%, 3%, 1)",
    secondary: "hsla(0, 0%, 34%, 1)",
    tertiary: "hsla(177, 100%, 32%, 1)",
    disabled: "hsla(192, 5%, 82%, 1)",
  },
};
