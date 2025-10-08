// Import Auth và Google Provider từ file cấu hình đã sửa
import { auth, db } from "./firebase_config.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Lấy các phần tử DOM
const loginForm = document.getElementById("loginForm");

// --- 2. Xử lý ĐĂNG NHẬP bằng Email/Password (Dùng Firebase Auth) ---
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorMsg = document.getElementById("login-error");
    errorMsg.textContent = "";

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      // kiểm tra tài khoản này có role là admin
      const userDoc = await getDoc(doc(db, "users", uid));
      console.log(userDoc);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log(userData);
        if (userData.role !== "admin") {
          throw new Error("Bạn không có quyền truy cập vào trang này.");
        }
      } else {
        throw new Error("Không tìm thấy hồ sơ người dùng.");
      }
      alert("Đăng nhập thành công! Chuyển hướng đến Bảng điều khiển.");
      window.location.href = "./html/home.html";
    } catch (error) {
      let message = "Đăng nhập thất bại: " + error.message;
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        message = "Sai email hoặc mật khẩu.";
      }
      errorMsg.textContent = message;
      console.error("Lỗi Đăng nhập: ", error);
    }
  });
}
