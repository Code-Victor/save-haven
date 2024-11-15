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
        animation: "slide_from_right",
        gestureEnabled: true,
        gestureDirection: "horizontal",
        animationDuration: 400,
        ...screenOptions,
      }}
      {...props}
    />
  );
}
