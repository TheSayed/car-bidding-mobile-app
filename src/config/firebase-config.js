import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCDT-U-8fFyCwhOb06YsXoMD2RWWmfO3qM",
  authDomain: "carbid-666f8.firebaseapp.com",
  projectId: "carbid-666f8",
  storageBucket: "carbid-666f8.firebasestorage.app",
  messagingSenderId: "605805604155",
  appId: "1:605805604155:web:66391c0ffdc674f072db1e",
  measurementId: "G-K7TR4Y7V0E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with AsyncStorage persistence (for React Native)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Optional: Analytics (only works on web)
export const analytics = getAnalytics(app);

export default app;
