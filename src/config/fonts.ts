import { createFont } from "tamagui";

// #region Font setup
const fontSizes = {
  1: 12,
  2: 14,
  3: 16,
  true: 16,
  4: 18,
  5: 20,
  6: 24,
  "6.5": 26,
  7: 30,
  "7.5": 32,
  8: 36,
  "8.5": 40,
  9: 48,
  10: 64,
  11: 80,
  12: 96,
};
const dmSans = createFont({
  family: "DM Sans",
  size: fontSizes,
  // Simulating lineHeight: 1.3 or 130% in avenir font
  lineHeight: Object.fromEntries(
    Object.entries(fontSizes).map(([k, v]) => [k, +v * 1.3])
  ) as typeof fontSizes,
  weight: {
    1: "300",
    2: "400",
    true: "400",

    3: "500",
    4: "600",
    5: "700",
  },

  letterSpacing: {
    4: 0,
    8: -1,
  },
  face: {
    true: {
      normal: "dmSans",
    },
    400: { normal: "dmSans" },
    500: { normal: "dmSansMedium" },
    700: { normal: "dmSansBold" },
  },
});
const gilroy = createFont({
  family: "Gilroy",
  size: fontSizes,
  // Simulating lineHeight: 1.3 or 130% in avenir font
  lineHeight: Object.fromEntries(
    Object.entries(fontSizes).map(([k, v]) => [k, +v * 1.3])
  ) as typeof fontSizes,
  weight: {
    1: "300",
    2: "400",
    true: "400",
    3: "500",
    4: "600",
    5: "700",
  },

  letterSpacing: {
    4: 0,
    8: -1,
  },
  face: {
    true: {
      normal: "gilroy",
    },
    400: { normal: "gilroy" },
    500: { normal: "gilroyMedium" },
    600: { normal: "gilroySemibold" },
    700: { normal: "gilroyBold" },
  },
});

export const fonts = {
  dmSans,
  body: dmSans,
  gilroy,
};
// #endregion
