export * from "./convertThemeColorsToRootColors";
export * from "./isDev";
export * from "./lazyImport";

export const formatNumberOnDisplay = (number: number, separator: string) => {
  let numberStringified = number.toString();
  let toIgnore = numberStringified.length % 3;
  let charsToIgnore = numberStringified.slice(0, toIgnore);
  let charsToTransform = numberStringified.slice(toIgnore);

  let regExp = /([0-9]{3})(?=[0-9]{3})/g;

  return `${charsToIgnore}${
    toIgnore > 0 ? separator : ""
  }${charsToTransform.replace(regExp, "$1 ")}`;
};
