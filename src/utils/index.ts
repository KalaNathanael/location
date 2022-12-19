import { IAutoCompleteList } from "@/interfaces";

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

export const sortAutoCompleteList = (list: IAutoCompleteList[]) => {
  let lowercaseList = list.map((elt, idx) => {
    return {
      ...elt,
      label: elt.label.toLowerCase(),
      idx: idx,
    };
  });
  lowercaseList.sort((a, b) => a.label.localeCompare(b.label, "fr"));

  return lowercaseList.map((elt) => list[elt.idx]);
};

export const changeDateStringFormat = (date: string) => {
  let splitted = date.split("-");
  return `${splitted[2]}-${splitted[1]}-${splitted[0]}`;
};

export const isEmpty = (value: any): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === "object" &&
    Object.keys(value).length === 0 &&
    typeof value.getMonth !== "function") ||
  (typeof value === "string" && value.trim().length === 0);

export const formatPriceOnDisplay = (number: number) => {
  let numberStringified = number.toString();
  let charsToIgnore = numberStringified.length % 3;
  let regExp = null;
  switch (charsToIgnore) {
    case 0:
      regExp = /(?<=[0-9]{3})([0-9]{3})/g;
      break;
    case 1:
      regExp = /(?<=[0-9]{1})([0-9]{3})/g;
      break;
    case 2:
      regExp = /(?<=[0-9]{2})([0-9]{3})/g;
      break;
    default:
      regExp = null;
  }
  return numberStringified.replace(regExp, " $1");
};
