//firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';



const firebaseConfig = {
  apiKey: "AIzaSyCV-BnT0TVbdW2necvRCWASD48TDYmgSus",
  authDomain: "caloriesstep.firebaseapp.com",
  projectId: "caloriesstep",
  storageBucket: "caloriesstep.appspot.com",
  messagingSenderId: "460286698350",
  appId: "1:460286698350:web:4b9163ca293bfd31dc577f",
  measurementId: "G-8XZ5HT17Z1"
};

const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const db = getFirestore(app);

//Added for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, db };
