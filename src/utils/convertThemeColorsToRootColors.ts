export type TThemeColors = {
  [key: string]: TThemeColors | string;
};

type TRecursiveDeeper = (
  workingObject: TThemeColors,
  workingKey?: string
) => void;
type TConvertThemeColorsToRootColors = (arg: TThemeColors) => string;

const convertThemeColorsToRootColors: TConvertThemeColorsToRootColors = (
  themeColorsObj
) => {
  let colors: string = "";
  let currentKey: string[] = [];
  let deeping: number = 0;

  const nominalFunction: TRecursiveDeeper = (obj, optionalKey) => {
    const keys: string[] = Object.keys(obj).map((key) => key);

    let currentLevel: TThemeColors = {};

    keys.forEach((key, idx) => {
      if (idx < 1) {
        currentKey.push(key);
      } else {
        if (currentKey.length > 1) currentKey.pop();
        currentKey.push(key);
      }

      currentLevel = { ...obj };

      if (typeof currentLevel[key] === "string") {
        let tempCurrentKey = [...currentKey];

        if (optionalKey === undefined && deeping === 1) {
          tempCurrentKey.shift();
        }

        const prop = tempCurrentKey.join("-");
        const color = `--${prop}: ${currentLevel[key]}`;

        colors += `${color};`;

        if (idx === keys.length - 1) {
          deeping -= 1;
        }
      } else if (typeof currentLevel[key] === "object") {
        deeping += 1;

        nominalFunction(currentLevel[key] as TThemeColors, key);
      }
    });

    currentKey = currentKey.slice(0, deeping);

    currentLevel = {};
  };

  nominalFunction(themeColorsObj);

  return colors;
};

export default convertThemeColorsToRootColors;
