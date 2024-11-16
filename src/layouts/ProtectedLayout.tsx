import { Redirect, Stack } from "expo-router";
import { useStore } from "@/stores";
export default function ProtectedLayout() {
  const user = useStore((s) => s.user);
  console.log("Protected layout");
  if (!Boolean(user)) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return (
    <Stack
      initialRouteName="/(tabs)/"
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
