import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSIUHnjv8GmIX4P2r1ypxRPjBRxOyPWFA",
  authDomain: "millssolicit.firebaseapp.com",
  projectId: "millssolicit",
  storageBucket: "millssolicit.firebasestorage.app",
  messagingSenderId: "777728419181",
  appId: "1:777728419181:web:83545f885fbabd4594a664"
};

const app = initializeApp(firebaseConfig);

// 👉 conexão com banco Firestore
export const db = getFirestore(app);