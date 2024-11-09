import { styled, Text as TamaguiText } from "tamagui";

export const Text = styled(TamaguiText, {
  fontFamily: "$dmSans",
  color: "black",
  fontSize: "$3",
  lineHeight: "$3",
  fontWeight: "400",
  variants: {
    fontSize: {
      "...fontSize": (val) => ({
        fontSize: val,
        lineHeight: val,
      }),
    },
    fos: {
      "...fontSize": (val) => ({
        fontSize: val,
        lineHeight: val,
      }),
    },
  } as const,
});
