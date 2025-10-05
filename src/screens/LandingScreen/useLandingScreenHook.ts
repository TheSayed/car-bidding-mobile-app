import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Alert, Linking } from "react-native";
import { signOutUser } from "../../utilis/AuthService";
import { RootState } from "../../redux/store";
import { clearUserInfo } from "../../redux/userSlice";

const useLandingScreenHook = () => {
  const LINKEDIN_URL = "https://www.linkedin.com/in/ahmedkotp";
  const userName = useAppSelector((state: RootState) => state.user.displayName);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const handleNavigateToAuction = () => {
    navigation.navigate("Auction" as never);
  };

  const handleLinkedInPress = async () => {
    // Use a single HTTPS link for maximum compatibility
    const supported = await Linking.canOpenURL(LINKEDIN_URL);

    if (supported) {
      await Linking.openURL(LINKEDIN_URL);
    } else {
      Alert.alert(`Don't know how to open this URL: ${LINKEDIN_URL}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser(); // 1. Sign out from Firebase
      dispatch(clearUserInfo()); // 2. Clear user data from Redux // The change in Auth state should automatically navigate to the Login screen
    } catch (error) {
      Alert.alert(
        "Logout Failed",
        "There was an error signing you out. Please try again."
      );
      console.error("Logout Error:", error);
    } finally {
      navigation.navigate("Login" as never);
    }
  };

  return {
    userName,
    handleNavigateToAuction,
    handleLinkedInPress,
    handleLogout,
  };
};

export default useLandingScreenHook;
