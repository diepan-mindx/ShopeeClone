// Import Firebase core & auth từ CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Config Firebase (copy từ Firebase Console của bạn)
const firebaseConfig = {
  apiKey: "AIzaSyDr2b-hpsJ_GKDnLR49hVE99bIc8BAVFdI",
  authDomain: "checkpoint2-41b4e.firebaseapp.com",
  projectId: "checkpoint2-41b4e",
  storageBucket: "checkpoint2-41b4e.appspot.com",
  messagingSenderId: "185762311880",
  appId: "1:185762311880:web:aa19cde6621f7b2049fffd",
  measurementId: "G-MG9WEBL663",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Hàm đăng ký
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Hàm đăng nhập
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Hàm đăng xuất
export function logOut() {
  return signOut(auth);
}
