import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./id.js"; // Import auth từ file khởi tạo

// Lưu ý: Các biến 'email' và 'password' cần được định nghĩa hoặc truyền vào hàm
function userLogin(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Đăng nhập thành công
        const user = userCredential.user;
        console.log("Đăng nhập thành công:", user.email);
        // Chuyển hướng người dùng sau khi đăng nhập
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Lỗi đăng nhập:", errorCode, errorMessage);
        // Hiển thị thông báo lỗi cho người dùng
      });
}

// Bạn sẽ cần gọi hàm userLogin(email, password) khi người dùng nhấn nút Đăng nhập