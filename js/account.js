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
    // Get current user from localStorage or return default
    const user = localStorage.getItem("currentUser");
    return user
      ? JSON.parse(user)
      : {
          name: "Người dùng",
          email: "user@example.com",
          joinDate: new Date().toLocaleDateString("vi-VN"),
          profilePicture: "../user.png",
        };
  }

  loadUserData() {
    // Load user data into the form
    document.getElementById("account-name").value = this.currentUser.name;
    document.getElementById("account-email").textContent =
      this.currentUser.email;
    document.getElementById("join-date").textContent =
      this.currentUser.joinDate;

    // Load profile picture
    const profilePic = document.getElementById("profile-picture");
    profilePic.src = this.currentUser.profilePicture || "../user.png";
  }

  setupEventListeners() {
    // Password form submission
    document.getElementById("password-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.changePassword();
    });

    // Close buttons for modals
    document.querySelectorAll(".close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        if (modal) {
          modal.style.display = "none";
        }
      });
    });

    // Email click handler
    document.getElementById("account-email").addEventListener("click", () => {
      this.showEmailInfo();
    });
  }

  setupProfilePictureUpload() {
    const fileInput = document.getElementById("profile-upload");
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        this.uploadProfilePicture(file);
      }
    });
  }

  uploadProfilePicture(file) {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn một file ảnh!");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      alert("File ảnh không được vượt quá 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;

      // Update profile picture
      document.getElementById("profile-picture").src = imageData;

      // Save to localStorage
      this.currentUser.profilePicture = imageData;
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));

      alert("Ảnh hồ sơ đã được cập nhật thành công!");
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

    // Update user data
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

    // In a real app, you would verify current password with server
    // For demo purposes, we'll just update the password
    alert("Mật khẩu đã được thay đổi thành công!");

    // Clear form
    document.getElementById("password-form").reset();
    this.closePasswordModal();
  }

  logout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      // Clear user session
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");

      // Redirect to index page
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

// Global functions for onclick events
function saveAccountName() {
  accountManager.saveAccountName();
}

function logout() {
  accountManager.logout();
}

function changePassword() {
  document.getElementById("password-modal").style.display = "block";
}

function closePasswordModal() {
  accountManager.closePasswordModal();
}

function manageAddresses() {
  accountManager.manageAddresses();
}

function viewOrderHistory() {
  accountManager.viewOrderHistory();
}

// Initialize account manager when DOM is loaded
let accountManager;
document.addEventListener("DOMContentLoaded", () => {
  accountManager = new AccountManager();
});

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("password-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Close with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
  }
});
