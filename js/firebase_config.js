// firebase_config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Cấu hình Firebase (đúng với project của bạn)
const firebaseConfig = {
  apiKey: "AIzaSyDdmY0eZzw0R3yqdliqQHyiplBlvPgduoo",
  authDomain: "jsi35-be345.firebaseapp.com",
  projectId: "jsi35-be345",
  storageBucket: "jsi35-be345.firebasestorage.app",
  messagingSenderId: "780445617838",
  appId: "1:780445617838:web:c114556667b82f6fb5673f",
  measurementId: "G-FYYF98V50D"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các đối tượng cần dùng
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
