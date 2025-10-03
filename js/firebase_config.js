// firebase_config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Cấu hình Firebase project của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDdmY0eZzw0R3yqdliqQHyiplBlvPgduoo",
  authDomain: "jsi35-be345.firebaseapp.com",
  databaseURL: "https://jsi35-be345-default-rtdb.firebaseio.com",
  projectId: "jsi35-be345",
  storageBucket: "jsi35-be345.firebasestorage.app",
  messagingSenderId: "780445617838",
  appId: "1:780445617838:web:c114556667b82f6fb5673f",
  measurementId: "G-FYYF98V50D"
};

const app = initializeApp(firebaseConfig);

// EXPORT các đối tượng chính
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);