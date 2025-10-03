// settings.js
import { auth } from "./firebase_config.js";
import { 
    onAuthStateChanged, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const settingsForm = document.getElementById('settingsForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password'); // Mật khẩu mới

let currentUser = null;

// Tải thông tin người dùng hiện tại
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        nameInput.value = user.displayName || "Chưa có tên";
        emailInput.value = user.email;
        emailInput.disabled = true; // Không cho phép sửa email trực tiếp
    }
});

if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = nameInput.value;
        const newPassword = passwordInput.value;
        
        if (!currentUser) {
            alert("Lỗi: Không tìm thấy người dùng hiện tại.");
            return;
        }

        try {
            let updateSuccessful = false;

            // 1. Cập nhật Tên hiển thị
            if (newName !== currentUser.displayName) {
                await updateProfile(currentUser, { displayName: newName });
                updateSuccessful = true;
            }

            // 2. Cập nhật Mật khẩu
            if (newPassword) {
                if (newPassword.length < 6) {
                    alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
                    return;
                }
                // *LƯU Ý QUAN TRỌNG: Cần re-authenticate nếu phiên đăng nhập quá lâu
                // (Chức năng re-authenticate phức tạp và cần thêm form)
                await updatePassword(currentUser, newPassword);
                passwordInput.value = ''; // Xóa mật khẩu sau khi cập nhật
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