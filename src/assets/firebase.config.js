// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKeKmhR9MVFaayuyejZ0-LXQ2ZUf9H_XU",
  authDomain: "market-project-54410.firebaseapp.com",
  projectId: "market-project-54410",
  storageBucket: "market-project-54410.firebasestorage.app",
  messagingSenderId: "377127377453",
  appId: "1:377127377453:web:f3477c8b66b6dcc40e76a4",
  measurementId: "G-P6QCRE03GY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
export const db = getFirestore(app);