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
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    
  .button-group {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: flex-end;

    .cancel-button,
    .submit-button {
      min-width: 93px;
      height: 36px;

      button {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.33;
      }
    }

    .cancel-button {
      margin-right: 10px;
    }
  }

  .swal2-container {
    .swal2-title{
      line-height: 1.5;
    }
  }
`;

export default GloablStyle;
