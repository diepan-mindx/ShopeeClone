// Import auth, googleProvider từ file cấu hình Firebase
import { auth, googleProvider } from "./firebase_config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js"; // Import các hàm Firebase Auth

// Lấy các phần tử DOM (cần được định nghĩa global hoặc lấy từ đầu file)
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const ggLoginBtn = document.getElementById("gg_login"); 

// --- 1. Chuyển tab (Giữ nguyên logic HTML) ---
if (loginTab && signupTab && loginForm && signupForm) {
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
}


// --- 2. Xử lý ĐĂNG NHẬP bằng Email/Password (Sử dụng Firebase Auth) ---
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const errorMsg = document.getElementById("login-error");
        errorMsg.textContent = ""; // Xóa thông báo lỗi cũ

        try {
            // Gọi hàm đăng nhập của Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            alert("Đăng nhập thành công! Email: " + user.email);
            window.location.href = "/html/home.html";
        } catch (error) {
            // Xử lý lỗi từ Firebase
            let message = "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = "Sai email hoặc mật khẩu.";
            } else if (error.code === 'auth/invalid-email') {
                message = "Email không hợp lệ.";
            }
            errorMsg.textContent = message;
            console.error("Lỗi Đăng nhập: ", error);
        }
    });
}


// --- 3. Xử lý ĐĂNG KÝ (Sử dụng Firebase Auth) ---
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const confirm = document.getElementById("signup-confirm").value;
        // const name = document.getElementById("signup-name").value; // Để xử lý sau (updateProfile)
        const errorMsg = document.getElementById("signup-error");
        errorMsg.textContent = ""; // Xóa thông báo lỗi cũ

        if (password !== confirm) {
            errorMsg.textContent = "Mật khẩu không khớp!";
            return;
        }

        try {
            // Gọi hàm đăng ký của Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            alert("Đăng ký thành công! Email: " + user.email);

            // TODO: Bạn có thể thêm đoạn code để cập nhật tên hiển thị ở đây
            // import { updateProfile } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
            // await updateProfile(user, { displayName: name });
            
            window.location.href = "/html/home.html";
        } catch (error) {
            // Xử lý lỗi từ Firebase
            let message = "Đăng ký thất bại. Vui lòng thử lại.";
            if (error.code === 'auth/email-already-in-use') {
                message = "Email này đã được sử dụng.";
            } else if (error.code === 'auth/weak-password') {
                message = "Mật khẩu quá yếu (cần ít nhất 6 ký tự).";
            }
            errorMsg.textContent = message;
            console.error("Lỗi Đăng ký: ", error);
        }
    });
}

// --- 4. Xử lý ĐĂNG NHẬP bằng GOOGLE ---
if (ggLoginBtn) {
    ggLoginBtn.addEventListener("click", async () => {
        try {
            // Gọi hàm đăng nhập Google
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            alert("Đăng nhập bằng Google thành công! Tên: " + user.displayName);
            
            window.location.href = "/html/home.html";
        } catch (error) {
            // Xử lý lỗi
            console.error("Lỗi Đăng nhập Google: ", error);
            document.getElementById("login-error").textContent = "Đăng nhập Google thất bại.";
        }
    });
}