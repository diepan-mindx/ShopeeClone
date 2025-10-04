// settings.js - Quản lý Cài đặt tài khoản (có avatar, phone, address)
import { auth, db } from "./firebase_config.js";
import { 
  onAuthStateChanged, 
  updateProfile, 
  updatePassword 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { 
  doc, 
  getDoc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// DOM elements
const settingsForm = document.getElementById("settingsForm");
const avatarInput = document.getElementById("avatar");
const avatarPreview = document.getElementById("avatarPreview");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");

let currentUser = null;

// Load user info
onAuthStateChanged(auth, async (user) => {// Hiển thị email người dùng
const userEmailInput = document.getElementById("userEmail");
if (userEmailInput && user.email) {
  userEmailInput.value = user.email;
}

  if (user) {emailInput.value = user.email || "";

    currentUser = user;

    // Hiển thị dữ liệu từ Firebase Auth
    nameInput.value = user.displayName || "";
    emailInput.value = user.email;
    avatarInput.value = user.photoURL || "";
    if (user.photoURL) {
      avatarPreview.src = user.photoURL;
      avatarPreview.style.display = "block";
    }

    // Load thêm dữ liệu từ Firestore
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      phoneInput.value = data.phone || "";
      addressInput.value = data.address || "";
    }
  }
});

// Preview avatar khi nhập URL
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

// Submit form
if (settingsForm) {
  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const newName = nameInput.value.trim();
    const newAvatar = avatarInput.value.trim();
    const newPassword = passwordInput.value.trim();
    const newPhone = phoneInput.value.trim();
    const newAddress = addressInput.value.trim();

    try {
      let updated = false;

      // Cập nhật Profile (Auth)
      await updateProfile(currentUser, {
        displayName: newName || currentUser.displayName,
        photoURL: newAvatar || currentUser.photoURL,
      });
      updated = true;

      // Cập nhật mật khẩu (nếu có)
      if (newPassword) {
        if (newPassword.length < 6) {
          alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
          return;
        }
        await updatePassword(currentUser, newPassword);
        passwordInput.value = "";
        updated = true;
      }

      // Cập nhật Firestore (bổ sung thông tin cá nhân)
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, {
        displayName: newName,
        photoURL: newAvatar,
        phone: newPhone,
        address: newAddress,
        email: currentUser.email,
        role: "admin" // giữ nguyên role admin
      }, { merge: true });

      if (updated) {
        alert("✅ Cập nhật thành công!");
      } else {
        alert("Không có thay đổi nào.");
      }

    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      if (error.code === "auth/requires-recent-login") {
        alert("⚠️ Vui lòng đăng nhập lại trước khi đổi mật khẩu.");
      } else {
        alert("❌ Lỗi: " + error.message);
      }
    }
  });
}
