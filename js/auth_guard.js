// /js/auth_guard.js

import { auth } from "./firebase_config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js"; 

// 1. Bảo vệ trang
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
        window.location.href = "/index.html"; 
    }
    // Logic hiển thị tên người dùng (nếu có)
    const userInfoEl = document.getElementById('user-info');
    if (userInfoEl && user) {
        userInfoEl.textContent = `Xin chào, ${user.displayName || user.email}!`;
    }
});

// 2. Xử lý nút Đăng xuất (id="logout")
const logoutButton = document.getElementById('logout');

if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            // onAuthStateChanged sẽ tự chuyển hướng về /index.html
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
            alert("Đăng xuất thất bại!");
        }
    });
}