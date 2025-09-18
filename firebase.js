// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// ⚠️ Dán config từ Firebase Console của bạn vào đây
const firebaseConfig = {
  apiKey: "AIza...abc",
  authDomain: "jsi35-be345.firebaseapp.com",
  projectId: "jsi35-be345",
  storageBucket: "jsi35-be345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef12345"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
