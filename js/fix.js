// Import các hàm cần thiết từ Firebase SDK (sử dụng đường dẫn CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
// Sửa lỗi: Import getFirestore từ firebase-firestore.js
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; 

// Cấu hình Firebase project (Lấy từ firebase_config.js)
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

// Khởi tạo Cloud Firestore và xuất 'db' để các file khác sử dụng
export const db = getFirestore(app);