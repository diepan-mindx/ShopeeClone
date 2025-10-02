// ==============================
// Import Firebase
// ==============================
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { app } from "../js/firebase-config.js";

// Khởi tạo Auth
const auth = getAuth(app);

// ==============================
// Account Manager Class
// ==============================
class AccountManager {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.init();
    this.listenFirebaseAuth();
  }

  // ==============================
  // Khởi tạo
  // ==============================
  init() {
    this.loadUserData();
    this.setupEventListeners();
    this.setupProfilePictureUpload();
  }

  // Lấy thông tin user (ưu tiên Firebase, fallback localStorage)
  getCurrentUser() {
    const user = auth.currentUser;
    if (user) {
      return {
        name: user.displayName || "",
        email: user.email,
        joinDate: new Date(user.metadata.creationTime).toLocaleDateString(
          "vi-VN"
        ),
        profilePicture: user.photoURL || "../assets/user.png",
      };
    }

    const localUser = localStorage.getItem("currentUser");
    return localUser
      ? JSON.parse(localUser)
      : {
          name: "",
          email: "",
          joinDate: new Date().toLocaleDateString("vi-VN"),
          profilePicture: "../assets/user.png",
        };
  }

  // Load dữ liệu lên UI
  loadUserData() {
    document.getElementById("account-name").value = this.currentUser.name || "";
    document.getElementById("account-email").textContent =
      this.currentUser.email || "Chưa đăng nhập";
    document.getElementById("join-date").textContent =
      this.currentUser.joinDate || "--/--/----";

    const profilePic = document.getElementById("profile-picture");
    profilePic.src = this.currentUser.profilePicture || "../assets/user.png";
  }

  // ==============================
  // Event Listeners
  // ==============================
  setupEventListeners() {
    // Submit đổi mật khẩu
    document.getElementById("password-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.changePassword();
    });

    // Đóng modal
    document.querySelectorAll(".close").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        if (modal) modal.style.display = "none";
      });
    });

    // Click email để xem chi tiết
    document.getElementById("account-email").addEventListener("click", () => {
      if (this.currentUser.email) {
        this.showEmailInfo();
      }
    });
  }

  // Upload avatar
  setupProfilePictureUpload() {
    const fileInput = document.getElementById("profile-upload");
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) this.uploadProfilePicture(file);
    });
  }

  uploadProfilePicture(file) {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn một file ảnh!");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ảnh không được vượt quá 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      document.getElementById("profile-picture").src = imageData;
      this.currentUser.profilePicture = imageData;
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
    };
    reader.readAsDataURL(file);
  }

  // ==============================
  // Quản lý hồ sơ
  // ==============================
  saveAccountName() {
    const newName = document.getElementById("account-name").value.trim();
    if (!newName) {
      alert("Vui lòng nhập tên hiển thị!");
      return;
    }
    if (newName.length < 2) {
      alert("Tên hiển thị phải có ít nhất 2 ký tự!");
      return;
    }
    this.currentUser.name = newName;
    localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
    alert("Tên hiển thị đã được cập nhật!");
  }

  // ==============================
  // Quản lý mật khẩu
  // ==============================
  changePassword() {
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    alert("Mật khẩu đã được thay đổi thành công!");
    document.getElementById("password-form").reset();
    this.closePasswordModal();
  }

  // ==============================
  // Đăng xuất & chuyển tài khoản
  // ==============================
  logout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      signOut(auth)
        .then(() => {
          localStorage.removeItem("currentUser");
          localStorage.removeItem("isLoggedIn");
          window.location.href = "../index.html";
        })
        .catch((err) => alert("Lỗi đăng xuất: " + err.message));
    }
  }

  switchAccount() {
    signOut(auth)
      .catch(() => {})
      .finally(() => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");
        // 🔥 Sửa đường dẫn login cho đúng
        window.location.href = "login.html";
      });
  }

  // ==============================
  // Tính năng khác (placeholder)
  // ==============================
  manageAddresses() {
    alert("Tính năng quản lý địa chỉ đang được phát triển!");
  }

  viewOrderHistory() {
    alert("Tính năng lịch sử đơn hàng đang được phát triển!");
  }

  // ==============================
  // Modal helpers
  // ==============================
  closePasswordModal() {
    document.getElementById("password-modal").style.display = "none";
  }

  showEmailInfo() {
    alert(`Email của bạn: ${this.currentUser.email}`);
  }

  // ==============================
  // Firebase Auth Listener
  // ==============================
  listenFirebaseAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = {
          name: user.displayName || "",
          email: user.email,
          joinDate: new Date(user.metadata.creationTime).toLocaleDateString(
            "vi-VN"
          ),
          profilePicture: user.photoURL || "../assets/user.png",
        };
        this.loadUserData();
      }
    });
  }
}

// ==============================
// Global functions cho onclick
// ==============================
function saveAccountName() {
  window.accountManager.saveAccountName();
}
function logout() {
  window.accountManager.logout();
}
function changePassword() {
  document.getElementById("password-modal").style.display = "block";
}
function closePasswordModal() {
  window.accountManager.closePasswordModal();
}
function manageAddresses() {
  window.accountManager.manageAddresses();
}
function viewOrderHistory() {
  window.accountManager.viewOrderHistory();
}
function switchAccount() {
  window.accountManager.switchAccount();
}

// ==============================
// Khởi tạo AccountManager
// ==============================
window.addEventListener("DOMContentLoaded", () => {
  window.accountManager = new AccountManager();
});

// ==============================
// Đóng modal khi click ngoài
// ==============================
window.onclick = function (event) {
  const modal = document.getElementById("password-modal");
  if (event.target === modal) modal.style.display = "none";
};

// ==============================
// ESC để đóng modal
// ==============================
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none";
    });
  }
});

// ==============================
// Gán event listeners cho nút
// ==============================
window.addEventListener("DOMContentLoaded", () => {
  window.accountManager = new AccountManager();

  // Mở chọn file ảnh
  document.getElementById("btn-edit-picture").addEventListener("click", () => {
    document.getElementById("profile-upload").click();
  });

  // Lưu tên hiển thị
  document
    .getElementById("btn-save-name")
    .addEventListener("click", () => window.accountManager.saveAccountName());

  // Đăng xuất
  document.getElementById("btn-logout").addEventListener("click", (e) => {
    e.preventDefault();
    window.accountManager.logout();
  });

  // Chuyển tài khoản
  document
    .getElementById("btn-switch-account")
    .addEventListener("click", () => window.accountManager.switchAccount());

  // Quản lý địa chỉ
  document
    .getElementById("btn-manage-address")
    .addEventListener("click", () => window.accountManager.manageAddresses());

  // Xem đơn hàng
  document
    .getElementById("btn-view-orders")
    .addEventListener("click", () => window.accountManager.viewOrderHistory());

  // Đóng modal mật khẩu
  document
    .getElementById("btn-close-modal")
    .addEventListener("click", () =>
      window.accountManager.closePasswordModal()
    );
});
