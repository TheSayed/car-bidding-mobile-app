import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

const CustomFonts = {
  "Jakarta-Regular": PlusJakartaSans_400Regular,
  "Jakarta-Medium": PlusJakartaSans_500Medium,
  "Jakarta-Bold": PlusJakartaSans_700Bold,
};

export type FontName = keyof typeof CustomFonts;

export const useAppFonts = () => {
  const [fontsLoaded, fontError] = useFonts(CustomFonts);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return { fontsLoaded, fontError };
};

export const FontFamilies = {
  regular: "Jakarta-Regular" as FontName,
  medium: "Jakarta-Medium" as FontName,
  bold: "Jakarta-Bold" as FontName,
};
