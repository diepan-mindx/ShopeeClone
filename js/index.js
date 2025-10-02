


    const loginTab = document.getElementById("login-tab");
    const signupTab = document.getElementById("signup-tab");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

   

    // Chuyển tab
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active");
      signupTab.classList.remove("active");
      loginForm.classList.add("active");
      signupForm.classList.remove("active");
    });

    signupTab.addEventListener("click", () => {
      signupTab.classList.add("active");
      loginTab.classList.remove("active");
      signupForm.classList.add("active");
      loginForm.classList.remove("active");
    });

    // Xử lý đăng nhập
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      const errorMsg = document.getElementById("login-error");

      const userData = JSON.parse(localStorage.getItem("user"));

      if(userData && email === userData.email && password === userData.password) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/html/home.html";
      } else {
        errorMsg.textContent = "Sai email hoặc mật khẩu!";
      }
    });

    // Xử lý đăng ký
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const confirm = document.getElementById("signup-confirm").value;
      const errorMsg = document.getElementById("signup-error");

      if(password !== confirm) {
        errorMsg.textContent = "Mật khẩu không khớp!";
        return;
      }

      const user = { name, email, password };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      alert("Đăng ký thành công!");
      window.location.href = "/html/home.html";
    });
    