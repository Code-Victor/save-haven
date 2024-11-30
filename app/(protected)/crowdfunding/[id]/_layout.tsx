import DefaultStackLayout from "@/layouts/DefaultStackLayout";
import { Stack } from "expo-router";
export default function CrowdfundingSavingsStack() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <DefaultStackLayout />
    </>
  );
}
