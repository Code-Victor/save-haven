import { OfflineBanner } from "@/components/OfflineBanner";
import { config } from "@/config/tamagui.config";
import { useFontsLoaded } from "@/hooks/use-font-loaded";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import BootSplash from "react-native-bootsplash";
import { TamaguiProvider, useTheme, YStack } from "tamagui";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SystemBars } from "react-native-edge-to-edge";
import { enableFreeze } from "react-native-screens";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

enableFreeze();
export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFontsLoaded();

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      BootSplash.hide({ fade: true });
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <Providers>
      <NavigationLayout />
      <Toaster richColors theme="light" swipeToDismissDirection="left" />
      <OfflineBanner />
    </Providers>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <TamaguiProvider config={config} defaultTheme={"light"}>
              {children}
            </TamaguiProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

export function NavigationLayout() {
  const theme = useTheme();
  return (
    <>
      <SystemBars style="light" />
      <Stack
        initialRouteName={"/(protected)/(tabs)"}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.background.val,
          },
        }}
      />
    </>
  );
}
