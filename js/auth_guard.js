// auth_guard.js
import { auth } from "./firebase_config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js"; 

// Hàm kiểm tra và bảo vệ trang
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
        console.log("Người dùng chưa đăng nhập, đang chuyển hướng...");
        window.location.href = "/index.html"; 
    } else {
        // Đã đăng nhập. Có thể hiển thị thông tin người dùng nếu cần
        console.log("Người dùng đã đăng nhập:", user.email);
    }
});

// Xử lý nút Đăng xuất
const logoutButton = document.getElementById('logout');

if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            // Sau khi signOut thành công, hàm onAuthStateChanged bên trên sẽ tự chạy 
            // và chuyển hướng người dùng về /index.html
            alert("Đăng xuất thành công!");
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
            alert("Đăng xuất thất bại! Vui lòng thử lại.");
        }
    });
}