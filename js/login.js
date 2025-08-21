const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const backBtn = document.getElementById("backBtn");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

backBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.history.back();
});

document.addEventListener("DOMContentLoaded", () => {
  const signUpForm = document.querySelector(".sign-up-container form");
  const signInForm = document.querySelector(".sign-in-container form");

  // Xử lý Sign Up
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = signUpForm
      .querySelector('input[placeholder="Name"]')
      .value.trim();
    const email = signUpForm
      .querySelector('input[placeholder="Email"]')
      .value.trim();
    const password = signUpForm
      .querySelector('input[placeholder="Password"]')
      .value.trim();

    if (!name || !email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newUser = {
      name: name,
      email: email,
      joinDate: new Date().toLocaleDateString("vi-VN"),
      profilePicture: "../user.png",
    };

    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");

    alert("Đăng ký thành công!");
    window.location.href = "shop.html";
  });

  // Xử lý Sign In
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = signInForm
      .querySelector('input[placeholder="Email"]')
      .value.trim();
    const password = signInForm
      .querySelector('input[placeholder="Password"]')
      .value.trim();

    if (!email || !password) {
      alert("Vui lòng nhập email và mật khẩu!");
      return;
    }

    let user = JSON.parse(localStorage.getItem("currentUser"));

    // Kiểm tra xem có user nào trong localStorage không và email có khớp không
    // Nếu không khớp, ta vẫn tạo một user mới với email vừa nhập để điền vào profile.
    if (!user || user.email !== email) {
      user = {
        name: "", // Để trống tên, người dùng có thể cập nhật sau
        email: email,
        joinDate: new Date().toLocaleDateString("vi-VN"),
        profilePicture: "../user.png",
      };
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");

    alert("Đăng nhập thành công!");
    window.location.href = "../index.html"; // Chuyển về trang chủ index.html
  });
});
