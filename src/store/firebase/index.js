import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyABe8Lj2iXavrUyWdyLy35vHh943iyqIaY",
  authDomain: "tinnitus-e18b6.firebaseapp.com",
  projectId: "tinnitus-e18b6",
  storageBucket: "tinnitus-e18b6.appspot.com",
  messagingSenderId: "804755813576",
  appId: "1:804755813576:web:cbf4546848e48132ec61fd",
};

const app = initializeApp(firebaseConfig);

// * For Firebase bug using React Native
// Firebase bug where auth and realtime db works in react native
// but firestore could not connect
export const db = initializeFirestore(app, {
  // * Use force long polling to fix bug
  experimentalForceLongPolling: true,
});

// * For Firebase using deprecated AsyncStorage from core instead of community
export const auth = initializeAuth(app, {
  // * Specify communicty package to use instead of core
  persistence: getReactNativePersistence(AsyncStorage),
});
export const provider = new GoogleAuthProvider();
