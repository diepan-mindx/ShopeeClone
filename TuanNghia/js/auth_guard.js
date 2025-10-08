import { auth, db } from "./firebase_config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// 1. Bảo vệ trang
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // Chưa đăng nhập → về trang login
        // window.location.href = "../index.html";
        return;
    }

    try {
        // Lấy thông tin user từ Firestore
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            alert("Tài khoản không tồn tại trong hệ thống!");
            await signOut(auth);
            window.location.href = "../index.html";
            return;
        }

        const data = snap.data();

        // 🔒 Chỉ cho admin vào
        if (data.role !== "admin") {
            alert("Bạn không có quyền truy cập trang quản trị!");
            await signOut(auth);
            window.location.href = "../index.html";
            return;
        }

        // Nếu là admin → hiển thị thông tin
        const userInfoEl = document.getElementById("user-info");
        if (userInfoEl) {
            userInfoEl.textContent = `Xin chào, ${data.displayName || user.email}! (Admin)`;
        }

    } catch (err) {
        console.error("Lỗi kiểm tra role:", err);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
        await signOut(auth);
        window.location.href = "../index.html";
    }
});

// 2. Xử lý nút Đăng xuất (id="logout")
const logoutButton = document.getElementById("logout");

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        try {
            await signOut(auth);
            // onAuthStateChanged sẽ tự chuyển hướng về /index.html
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
            alert("Đăng xuất thất bại!");
        }
    });
}
