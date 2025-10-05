import {
  signInAnonymously,
  updateProfile,
  signOut,
  User,
  onAuthStateChanged,
  Unsubscribe,
} from "firebase/auth";
import { auth } from "../config/firebase-config";
import { setUserInfo, clearUserInfo } from "../redux/userSlice";
import { AppDispatch } from "../redux/store";

export const signInWithUsername = async (username: string): Promise<User> => {
  try {
    if (!username || username.trim() === "") {
      throw new Error("Username cannot be empty.");
    }

    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: username.trim(),
    });

    return user;
  } catch (error) {
    const errorMessage = (error as Error).message || "Login failed.";
    console.error(
      "Login Error:",
      (error as any).code,
      (error as Error).message
    );
    throw new Error(errorMessage);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.error("Logout failed", e);
  }
};

export const observeAuthState = (dispatch: AppDispatch): Unsubscribe => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      dispatch(
        setUserInfo({
          uid: user.uid,
          displayName: user.displayName || "Guest",
        })
      );
    } else {
      dispatch(clearUserInfo());
    }
  });
};
