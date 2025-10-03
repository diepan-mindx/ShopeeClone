// Sửa đổi file firebase_config.js để export Auth và Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js"; // Thêm Auth
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; // Thêm Firestore (cho các file khác)

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

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo và Export các dịch vụ
export const auth = getAuth(app); // Export đối tượng Auth
export const googleProvider = new GoogleAuthProvider(); // Export đối tượng Google Provider
export const db = getFirestore(app); // Export đối tượng Firestore (nếu cần dùng cho các file như addsanpham.js)