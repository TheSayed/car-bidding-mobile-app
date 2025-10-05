import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDT-U-8fFyCwhOb06YsXoMD2RWWmfO3qM",
  authDomain: "carbid-666f8.firebaseapp.com",
  projectId: "carbid-666f8",
  storageBucket: "carbid-666f8.firebasestorage.app",
  messagingSenderId: "605805604155",
  appId: "1:605805604155:web:66391c0ffdc674f072db1e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
