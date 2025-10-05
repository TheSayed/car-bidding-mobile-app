import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { signInWithUsername } from "../../utilis/AuthService";
import { Alert } from "react-native";
import { setUserInfo } from "../../redux/userSlice";
import { useAppDispatch } from "../../redux/hooks";

const useLoginScreenHook = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Authenticate and get the Firebase User object
      const firebaseUser = await signInWithUsername(username);

      // Dispatch user data to Redux Store
      if (firebaseUser) {
        dispatch(
          setUserInfo({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || username.trim(),
          })
        );
      }

      // Navigate to Landing
      navigation.navigate("Landing" as never);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during login.";
      Alert.alert("Login Failed", errorMessage);
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || username.trim() === "";

  return {
    username,
    setUsername,
    isLoading,
    handleLogin,
    isButtonDisabled,
  };
};

export default useLoginScreenHook;
