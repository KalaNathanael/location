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
