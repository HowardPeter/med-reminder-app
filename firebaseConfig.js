// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence } from "firebase/auth";
import { initializeAuth } from "firebase/auth/cordova";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS9nbuxikCwMLy5XDksGientbeNwiWS1I",
  authDomain: "med-reminder-app.firebaseapp.com",
  projectId: "med-reminder-app",
  storageBucket: "med-reminder-app.firebasestorage.app",
  messagingSenderId: "566860143343",
  appId: "1:566860143343:web:0de1de00970a736c47d91a",
  measurementId: "G-KL00GGGM1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
    }
);

export const db = getFirestore(app);

export const userRef = collection(db, "users");