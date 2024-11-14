import { OfflineBanner } from "@/components/OfflineBanner";
import { config } from "@/config/tamagui.config";
import { useFontsLoaded } from "@/hooks/use-font-loaded";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  useToastState,
} from "@tamagui/toast";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, useColorScheme } from "react-native";
import BootSplash from "react-native-bootsplash";
import { TamaguiProvider, useTheme, YStack } from "tamagui";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SystemBars } from "react-native-edge-to-edge";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFontsLoaded();
  const colorScheme = useColorScheme();

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
      <ThemeProvider value={DefaultTheme}>
        <NavigationLayout />
        <OfflineBanner />
      </ThemeProvider>
    </Providers>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  return (
    <KeyboardProvider navigationBarTranslucent statusBarTranslucent>
      <TamaguiProvider
        config={config}
        // defaultTheme={colorScheme === "dark" ? "dark" : "light"}
        defaultTheme={"light"}
      >
        <ToastProvider swipeDirection="horizontal" duration={6000}>
          {children}
          <CurrentToast />
          <ToastViewport top="$8" left={0} right={0} />
        </ToastProvider>
      </TamaguiProvider>
    </KeyboardProvider>
  );
};

export function NavigationLayout() {
  const theme = useTheme();
  const user = false;
  return (
    <>
      <SystemBars style="light" />
      <Stack
        initialRouteName={!user ? "/onboarding" : "/(protected)/(tabs)"}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          animationDuration: 400,
          contentStyle: {
            backgroundColor: theme.background.val,
          },
        }}
      />
    </>
  );
}

export function CurrentToast() {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) return null;

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      theme="purple"
      borderRadius={"$6"}
      animation="quick"
    >
      <YStack ai="center" p="$2" gap="$2">
        <Toast.Title fontWeight="bold">{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  );
}
