import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config — replace these values to point at a different project.
const firebaseConfig = {
  apiKey: "AIzaSyBh8-UbeSxbah4M8EQxb9zNaPsc8AtlSWk",
  authDomain: "silkroute-4a557.firebaseapp.com",
  projectId: "silkroute-4a557",
  storageBucket: "silkroute-4a557.firebasestorage.app",
  messagingSenderId: "1095815576775",
  appId: "1:1095815576775:web:18ddf1d79cf59cb0a712e2",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);