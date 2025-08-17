const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const backBtn = document.getElementById("backBtn"); // nút back

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Nút Back → quay về trang trước
backBtn.addEventListener("click", (e) => {
  e.preventDefault(); // chặn hành vi mặc định của <a>
  window.history.back(); // quay lại trang trước đó
  // Hoặc: window.location.href = "../index.html"; nếu muốn chắc chắn về index.html
});
