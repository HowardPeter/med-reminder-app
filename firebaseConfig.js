// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

// const firebaseConfig = {
//   apiKey: "AIzaSyB_9-CBYxDMsgjNaJ5Eq8MVMApC-w0qVzc",
//   authDomain: "medicalreminder-969aa.firebaseapp.com",
//   projectId: "medicalreminder-969aa",
//   storageBucket: "medicalreminder-969aa.firebasestorage.app",
//   messagingSenderId: "548331444799",
//   appId: "1:548331444799:web:d13ae1b1fbf9ce2060768a"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
    }
);

export const db = getFirestore(app);

export const userRef = collection(db, "users");
export const otpRef = collection(db, 'otps')