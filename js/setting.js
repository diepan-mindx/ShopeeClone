// settings.js (Logic Cài đặt tài khoản mở rộng)
import { auth, db } from "./firebase_config.js";
import { onAuthStateChanged, updateProfile, updatePassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const settingsForm = document.getElementById('settingsForm');
const avatarInput = document.getElementById('avatar');
const avatarPreview = document.getElementById('avatarPreview');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        nameInput.value = user.displayName || "Chưa có tên";
        emailInput.value = user.email;
        avatarInput.value = user.photoURL || "";
        if (user.photoURL) {
            avatarPreview.src = user.photoURL;
            avatarPreview.style.display = "block";
        }

        // Load thêm info từ Firestore
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            const data = snap.data();
            phoneInput.value = data.phone || "";
            addressInput.value = data.address || "";
        }
    }
});

// Xem trước avatar khi nhập URL
if (avatarInput) {
    avatarInput.addEventListener("input", () => {
        if (avatarInput.value) {
            avatarPreview.src = avatarInput.value;
            avatarPreview.style.display = "block";
        } else {
            avatarPreview.style.display = "none";
        }
    });
}

if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const newName = nameInput.value.trim();
        const newAvatar = avatarInput.value.trim();
        const newPassword = passwordInput.value.trim();
        const newPhone = phoneInput.value.trim();
        const newAddress = addressInput.value.trim();

        try {
            let updateSuccessful = false;

            // Cập nhật tên & avatar trong Firebase Auth
            await updateProfile(currentUser, {
                displayName: newName || currentUser.displayName,
                photoURL: newAvatar || currentUser.photoURL
            });
            updateSuccessful = true;

            // Cập nhật mật khẩu nếu có
            if (newPassword) {
                if (newPassword.length < 6) {
                    alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
                    return;
                }
                await updatePassword(currentUser, newPassword);
                passwordInput.value = "";
                updateSuccessful = true;
            }

            // Cập nhật Firestore (thông tin thêm)
            const userRef = doc(db, "users", currentUser.uid);
            await setDoc(userRef, {
                displayName: newName,
                photoURL: newAvatar,
                phone: newPhone,
                address: newAddress,
                email: currentUser.email,
                role: "admin" // hoặc giữ nguyên nếu bạn có field role
            }, { merge: true });

            if (updateSuccessful) {
                alert("Cập nhật thành công!");
            } else {
                alert("Không có thay đổi nào.");
            }

        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            if (error.code === 'auth/requires-recent-login') {
                alert("Vui lòng đăng nhập lại để đổi mật khẩu.");
            } else {
                alert("Cập nhật thất bại: " + error.message);
            }
        }
    });
}
