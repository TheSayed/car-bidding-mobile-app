import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useAppFonts } from "./src/Fonts/Fonts";
import AuctionScreen from "./src/screens/AuctionScreen/AuctionScreen";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./src/Navigation/MainStack";
import LandingScreen from "./src/screens/LandingScreen/LandingScreen";
import LoginScreen from "./src/screens/LoginScreen/LoginScreen";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { observeAuthState } from "./src/utilis/AuthService";
import { useEffect, useState } from "react";
import { COLORS } from "./src/constant/COLORS";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { fontsLoaded, fontError } = useAppFonts();

  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Start observing auth state
    const unsubscribe = observeAuthState(store.dispatch);

    // Give Firebase time to check for existing session
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // Show loading while checking auth
  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.ACCENT_ORANGE} />
      </View>
    );
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
        <ExpoStatusBar style="auto" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 35,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
});
