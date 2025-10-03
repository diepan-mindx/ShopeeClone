// settings.js (Logic Cài đặt tài khoản)
import { auth } from "./firebase_config.js";
import { onAuthStateChanged, updateProfile, updatePassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const settingsForm = document.getElementById('settingsForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password'); 

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        nameInput.value = user.displayName || "Chưa có tên";
        emailInput.value = user.email;
        emailInput.disabled = true; // Không cho phép sửa email
    }
});

if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = nameInput.value;
        const newPassword = passwordInput.value;
        
        if (!currentUser) return;

        try {
            let updateSuccessful = false;

            // Cập nhật Tên hiển thị
            if (newName && newName !== currentUser.displayName) {
                await updateProfile(currentUser, { displayName: newName });
                updateSuccessful = true;
            }

            // Cập nhật Mật khẩu
            if (newPassword) {
                if (newPassword.length < 6) {
                    alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
                    return;
                }
                // Lưu ý: Người dùng có thể cần re-authenticate nếu phiên đăng nhập quá lâu
                await updatePassword(currentUser, newPassword);
                passwordInput.value = ''; 
                updateSuccessful = true;
            }

            if (updateSuccessful) {
                alert("Cập nhật cài đặt thành công!");
            } else {
                alert("Không có thay đổi nào được thực hiện.");
            }

        } catch (error) {
            console.error("Lỗi cập nhật cài đặt: ", error);
            if (error.code === 'auth/requires-recent-login') {
                alert("Vui lòng đăng nhập lại để xác minh danh tính trước khi đổi mật khẩu.");
            } else {
                alert("Cập nhật thất bại: " + error.message);
            }
        }
    });
}