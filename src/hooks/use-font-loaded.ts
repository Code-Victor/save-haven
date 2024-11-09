import { useFonts } from "expo-font";
import { useEffect } from "react";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

/**
 * Custom hook to load fonts and handle font loading state.
 * @returns {[boolean, Error]} An array containing two elements:
 * - `fontsLoaded`: A boolean indicating whether fonts are loaded successfully.
 * - `fontsError`: An error object if there was an issue loading fonts.
 */
export const useFontsLoaded = () => {
  const [fontsLoaded, fontsError] = useFonts({
    gilroy: require("@/assets/fonts/Gilroy-Regular.otf"),
    gilroyMedium: require("@/assets/fonts/Gilroy-Medium.otf"),
    gilroySemibold: require("@/assets/fonts/Gilroy-Semibold.otf"),
    gilroyBold: require("@/assets/fonts/Gilroy-Bold.otf"),
    dmSans: DMSans_400Regular,
    dmSansMedium: DMSans_500Medium,
    dmSansBold: DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);
  return [fontsLoaded, fontsError];
};
