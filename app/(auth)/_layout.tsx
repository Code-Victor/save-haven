import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        gestureDirection: "horizontal",
        animationDuration: 400,
      }}
      initialRouteName="onboarding"
    />
  );
};

export default AuthLayout;
