import { createGlobalStyle, DefaultTheme } from "styled-components";
import convertThemeColorsToRootColors, {
  TThemeColors,
} from "../utils/convertThemeColorsToRootColors";

const GloablStyle = createGlobalStyle`
    *, ::after, ::before {
        box-sizing: border-box;
        font-family: 'Roboto', sans-serif;
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

    .form-group {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }
    .button-group {
      display: flex;
      gap: 10px;
    }
`;

export default GloablStyle;
