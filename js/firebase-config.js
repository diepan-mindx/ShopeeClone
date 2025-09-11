// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔹 Config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDr2b-hpsJ_GKDnLR49hVE99bIc8BAVFdI",
  authDomain: "checkpoint2-41b4e.firebaseapp.com",
  projectId: "checkpoint2-41b4e",
  storageBucket: "checkpoint2-41b4e.appspot.com",
  messagingSenderId: "185762311880",
  appId: "1:185762311880:web:aa19cde6621f7b2049fffd",
  measurementId: "G-MG9WEBL663"
};

// Khởi tạo
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
