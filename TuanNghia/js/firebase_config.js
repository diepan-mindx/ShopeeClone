// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// 🔹 Config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDdmY0eZzw0R3yqdliqQHyiplBlvPgduoo",
  authDomain: "jsi35-be345.firebaseapp.com",
  databaseURL: "https://jsi35-be345-default-rtdb.firebaseio.com",
  projectId: "jsi35-be345",
  storageBucket: "jsi35-be345.firebasestorage.app",
  messagingSenderId: "780445617838",
  appId: "1:780445617838:web:c114556667b82f6fb5673f",
  measurementId: "G-FYYF98V50D",
};

// Khởi tạo
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
