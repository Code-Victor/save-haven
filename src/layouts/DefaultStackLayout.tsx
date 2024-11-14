import { Redirect, Stack } from "expo-router";
import * as React from "react";

type Props = React.ComponentProps<typeof Stack>;
export default function DefaultStackLayout({ screenOptions, ...props }: Props) {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "dmSansBold",
        },
        headerShadowVisible: false,
        ...screenOptions,
      }}
      {...props}
    />
  );
}
