import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const user = true;
  console.log("Protected layout");
  if (!user) {
    return <Redirect href="/onboarding" />;
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