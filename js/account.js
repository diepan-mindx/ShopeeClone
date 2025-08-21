// Account management functionality
class AccountManager {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.init();
  }

  init() {
    this.loadUserData();
    this.setupEventListeners();
    this.setupProfilePictureUpload();
  }

  getCurrentUser() {
    // Lấy user từ localStorage hoặc trả về mặc định nếu chưa có
    const user = localStorage.getItem("currentUser");
    return user
      ? JSON.parse(user)
      : {
          name: "",
          email: "",
          joinDate: new Date().toLocaleDateString("vi-VN"),
          profilePicture: "../user.png",
        };
  }

  loadUserData() {
    // Hiển thị thông tin
    document.getElementById("account-name").value = this.currentUser.name || "";
    document.getElementById("account-email").textContent =
      this.currentUser.email || "Chưa đăng nhập";
    document.getElementById("join-date").textContent =
      this.currentUser.joinDate || "--/--/----";

    // Avatar
    const profilePic = document.getElementById("profile-picture");
    profilePic.src = this.currentUser.profilePicture || "../user.png";
  }

  setupEventListeners() {
    // Submit đổi mật khẩu
    document.getElementById("password-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.changePassword();
    });

    // Nút đóng modal
    document.querySelectorAll(".close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        if (modal) modal.style.display = "none";
      });
    });

    // Click email
    document.getElementById("account-email").addEventListener("click", () => {
      if (this.currentUser.email) {
        this.showEmailInfo();
      }
    });
  }

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

      // Update avatar
      document.getElementById("profile-picture").src = imageData;

      // Save localStorage
      this.currentUser.profilePicture = imageData;
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
    };
    reader.readAsDataURL(file);
  }

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

  logout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
      // Chuyển hướng về trang index.html
      window.location.href = "../index.html";
    }
  }

  manageAddresses() {
    alert("Tính năng quản lý địa chỉ đang được phát triển!");
  }

  viewOrderHistory() {
    alert("Tính năng lịch sử đơn hàng đang được phát triển!");
  }

  closePasswordModal() {
    document.getElementById("password-modal").style.display = "none";
  }

  showEmailInfo() {
    alert(`Email của bạn: ${this.currentUser.email}`);
  }
}

// Global functions cho onclick trong HTML
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

// Khởi tạo
window.addEventListener("DOMContentLoaded", () => {
  window.accountManager = new AccountManager(); // gán global
});

// Đóng modal khi click ngoài
window.onclick = function (event) {
  const modal = document.getElementById("password-modal");
  if (event.target === modal) modal.style.display = "none";
};

// ESC để đóng modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none";
    });
  }
});
