import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Replace the values below with the keys from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDFAPfVsiHLw3YeBtFkso4eaRKP361otnM",
  authDomain: "relationship-mechanic.firebaseapp.com",
  projectId: "relationship-mechanic",
  storageBucket: "relationship-mechanic.firebasestorage.app",
  messagingSenderId: "96786669801",
  appId: "1:96786669801:web:a41f32870aec1fb6569078",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native Persistence
// This is crucial: it ensures the user stays logged in after restarting the app
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
