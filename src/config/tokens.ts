import { radius, size, zIndex } from "@tamagui/themes";
import { createTokens } from "@tamagui/web";
import { color } from "./colors";

// #region Design Tokens

export const spaceValues = {
  0: 0,
  "0.5": 2,
  1: 4,
  "1.5": 6,
  2: 8,
  "2.5": 10,
  3: 12,
  "3.5": 14,
  4: 16,
  true: 16,
  "4.5": 18,
  5: 20,
  "5.5": 22,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
};

type SizeKeysIn = keyof typeof size;
type Sizes = {
  [Key in SizeKeysIn extends `$${infer Key}` ? Key : SizeKeysIn]: number;
};
type SizeKeys = `${keyof Sizes extends `${infer K}` ? K : never}`;

// Updated sizeToSpace function to convert size values to Tailwind-like spacing
function sizeToSpace(v: number) {
  // Map specific size values to Tailwind-like spacing
  const sizeToSpaceMap: { [key: number]: number } = {
    0: 0, // 0
    2: 1, // 0.25 -> 1px
    4: 2, // 0.5 -> 2px
    8: 3, // 0.75 -> 3px
    20: 4, // 1 -> 4px
    24: 6, // 1.5 -> 6px
    28: 8, // 2 -> 8px
    32: 10, // 2.5 -> 10px
    36: 12, // 3 -> 12px
    40: 14, // 3.5 -> 14px
    44: 16, // 4 -> 16px
    48: 18, // 4.5 -> 18px
    52: 20, // 5 -> 20px
    64: 24, // 6 -> 24px
    74: 28, // 7 -> 28px
    84: 32, // 8 -> 32px
    94: 36, // 9 -> 36px
    104: 40, // 10 -> 40px
    124: 48, // 11 -> 48px
    144: 56, // 12 -> 56px
    164: 64, // 13 -> 64px
    184: 72, // 14 -> 72px
    204: 80, // 15 -> 80px
    224: 88, // 16,17 -> 88px
    244: 96, // 18 -> 96px
    264: 104, // 19 -> 104px
    284: 112, // 20 -> 112px
  };

  return sizeToSpaceMap[v] ?? v;
}

const spaces = Object.entries(size).map(([k, v]) => {
  return [k, sizeToSpace(v)] as const;
});

const spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k.slice(1)}`, -v]);

type SizeKeysWithNegatives =
  | Exclude<`-${SizeKeys extends `$${infer Key}` ? Key : SizeKeys}`, "-0">
  | SizeKeys;

type SizeKeysWithNegativesString = `$${SizeKeysWithNegatives}`;

export const space: {
  [Key in SizeKeysWithNegativesString]: Key extends keyof Sizes
    ? Sizes[Key]
    : number;
} = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative),
} as any;

export const tokens = createTokens({
  color,
  radius,
  zIndex,
  size,
  space,
});
