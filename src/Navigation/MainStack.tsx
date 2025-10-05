import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuctionScreen from "../screens/AuctionScreen/AuctionScreen";
import LandingScreen from "../screens/LandingScreen/LandingScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import { useAppSelector } from "../redux/hooks";

const Main = createNativeStackNavigator();

const MainStack = () => {
  const user = useAppSelector((state) => state.user);

  // Check if user is logged in by checking if uid exists
  const isLoggedIn = user.uid !== null;

  return (
    <Main.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isLoggedIn ? "Landing" : "Login"}
    >
      <Main.Screen name="Login" component={LoginScreen} />
      <Main.Screen name="Landing" component={LandingScreen} />
      <Main.Screen name="Auction" component={AuctionScreen} />
    </Main.Navigator>
  );
};

export default MainStack;
