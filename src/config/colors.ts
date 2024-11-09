import type { Variable } from "@tamagui/web";

export const colorTokens = {
  light: {
    green1: "#eeffef",
    green2: "#cbfdcc",
    green3: "#b2fdb3",
    green4: "#8ffc90",
    green5: "#79fb7b",
    green6: "#58fa5a",
    green7: "#50e452",
    green8: "#3eb240",
    green9: "#308a32",
    green10: "#256926",
    purple1: "#eae6ec",
    purple2: "#bdb0c3",
    purple3: "#9d8aa6",
    purple4: "#70547d",
    purple5: "#543364",
    purple6: "#29003d",
    purple7: "#250038",
    purple8: "#1d002b",
    purple9: "#170022",
    purple10: "#11001a",
  },
  dark: {
    green1: "#0A1F0B",
    green2: "#132A14",
    green3: "#1C361D",
    green4: "#254326",
    green5: "#2E5030",
    green6: "#376D39",
    green7: "#408A43",
    green8: "#4AA74C",
    green9: "#53C456",
    green10: "#5CE15F",
    purple1: "#2D1640",
    purple2: "#3D1D56",
    purple3: "#4E266D",
    purple4: "#613384",
    purple5: "#7642A0",
    purple6: "#8B51BB",
    purple7: "#A169D3",
    purple8: "#B784E8",
    purple9: "#CDA2F4",
    purple10: "#E4C3FF",
  },
};

export const lightShadowColor = "rgba(0,0,0,0.04)";
export const lightShadowColorStrong = "rgba(0,0,0,0.085)";
export const darkShadowColor = "rgba(0,0,0,0.2)";
export const darkShadowColorStrong = "rgba(0,0,0,0.3)";

export const darkColors = colorTokens.dark;

export const lightColors = colorTokens.light;

export const color = {
  // Transparent colors
  white0: "rgba(255,255,255,0)",
  white075: "rgba(255,255,255,0.75)",
  white05: "rgba(255,255,255,0.5)",
  white025: "rgba(255,255,255,0.25)",
  black0: "rgba(18,18,18,0)",
  black075: "rgba(18,18,18,0.75)",
  black05: "rgba(18,18,18,0.5)",
  black025: "rgba(18,18,18,0.25)",

  // Solid colors
  white1: "#FFFFFF",
  white2: "#F5F5F5",
  white3: "#E8E8E8",
  white4: "#DBDBDB",
  white5: "#CECECE",
  white6: "#C1C1C1",
  white7: "#B4B4B4",
  white8: "#A7A7A7",
  white9: "#9A9A9A",
  white10: "#8D8D8D",
  white11: "#808080",
  white12: "#737373",

  black1: "#181818",
  black2: "#1F1F1F",
  black3: "#262626",
  black4: "#2D2D2D",
  black5: "#343434",
  black6: "#3B3B3B",
  black7: "#424242",
  black8: "#494949",
  black9: "#505050",
  black10: "#575757",
  black11: "#5E5E5E",
  black12: "#EBEBEB",
  ...postfixObjKeys(lightColors, "Light"),
  ...postfixObjKeys(darkColors, "Dark"),
};

// #region --- utils ---

export function postfixObjKeys<
  A extends { [key: string]: Variable<string> | string },
  B extends string,
>(
  obj: A,
  postfix: B
): {
  [Key in `${keyof A extends string ? keyof A : never}${B}`]:
    | Variable<string>
    | string;
} {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [`${k}${postfix}`, v])
  ) as any;
}
// #endregion
