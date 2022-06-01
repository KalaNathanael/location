import { createGlobalStyle, DefaultTheme } from "styled-components";
import convertThemeColorsToRootColors, {
  TThemeColors,
} from "../utils/convertThemeColorsToRootColors";

const GloablStyle = createGlobalStyle`
    *, ::after, ::before {
        box-sizing: border-box;
        font-family: 'Open Sans', sans-serif;
        padding: 0;
        margin: 0;
    }

    body {
        overflow-x: hidden;
    }

    :root {
        ${({ theme }: { theme: DefaultTheme & { colors: TThemeColors } }) => {
          return convertThemeColorsToRootColors(theme.colors);
        }}
    }

    a {
        text-decoration: none;
    }
`;

export default GloablStyle;
