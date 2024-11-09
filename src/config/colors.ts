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
    purple1: "#ece6f0",
    purple2: "#c5b0d0",
    purple3: "#a98ab9",
    purple4: "#825498",
    purple5: "#693385",
    purple6: "#440066",
    purple7: "#3e005d",
    purple8: "#300048",
    purple9: "#250038",
    purple10: "#1d002b",
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
    purple1: "#130A1F",
    purple2: "#1C132A",
    purple3: "#251C36",
    purple4: "#2E2543",
    purple5: "#372E50",
    purple6: "#40376D",
    purple7: "#49408A",
    purple8: "#524AA7",
    purple9: "#5B53C4",
    purple10: "#645CE1",
  },
};

export const lightShadowColor = "rgba(0,0,0,0.04)";
export const lightShadowColorStrong = "rgba(0,0,0,0.085)";
export const darkShadowColor = "rgba(0,0,0,0.2)";
export const darkShadowColorStrong = "rgba(0,0,0,0.3)";

export const darkColors = colorTokens.dark;

export const lightColors = colorTokens.light;

export const color = {
  white0: "rgba(255,255,255,0)",
  white075: "rgba(255,255,255,0.75)",
  white05: "rgba(255,255,255,0.5)",
  white025: "rgba(255,255,255,0.25)",
  black0: "rgba(10,10,10,0)",
  black075: "rgba(10,10,10,0.75)",
  black05: "rgba(10,10,10,0.5)",
  black025: "rgba(10,10,10,0.25)",
  white1: "#fff",
  white2: "#f8f8f8",
  white3: "hsl(0, 0%, 96.3%)",
  white4: "hsl(0, 0%, 94.1%)",
  white5: "hsl(0, 0%, 92.0%)",
  white6: "hsl(0, 0%, 90.0%)",
  white7: "hsl(0, 0%, 88.5%)",
  white8: "hsl(0, 0%, 81.0%)",
  white9: "hsl(0, 0%, 56.1%)",
  white10: "hsl(0, 0%, 50.3%)",
  white11: "hsl(0, 0%, 42.5%)",
  white12: "hsl(0, 0%, 9.0%)",
  black1: "#050505",
  black2: "#151515",
  black3: "#191919",
  black4: "#232323",
  black5: "#282828",
  black6: "#323232",
  black7: "#424242",
  black8: "#494949",
  black9: "#545454",
  black10: "#626262",
  black11: "#a5a5a5",
  black12: "#fff",
  ...postfixObjKeys(lightColors, "Light"),
  ...postfixObjKeys(darkColors, "Dark"),
};

// #region --- utils ---

export function postfixObjKeys<
  A extends { [key: string]: Variable<string> | string },
  B extends string
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
