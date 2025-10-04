// /js/index.js

// Import Auth và Google Provider từ file cấu hình đã sửa
import { auth, googleProvider } from "./firebase_config.js"; 
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js"; 

// Lấy các phần tử DOM 
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
    const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const ggLoginBtn = document.getElementById("gg_login"); 


// --- 1. Chuyển tab ---
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


// --- 2. Xử lý ĐĂNG NHẬP bằng Email/Password (Dùng Firebase Auth) ---
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const errorMsg = document.getElementById("login-error");
        errorMsg.textContent = ""; 

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Đăng nhập thành công! Chuyển hướng đến Bảng điều khiển.");
            window.location.href = "/html/home.html";
        } catch (error) {
            let message = "Đăng nhập thất bại. Vui lòng kiểm tra lại Email/Mật khẩu.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = "Sai email hoặc mật khẩu.";
            }
            errorMsg.textContent = message;
            console.error("Lỗi Đăng nhập: ", error);
        }
    });
}


// --- 3. Xử lý ĐĂNG KÝ (Dùng Firebase Auth) ---
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const confirm = document.getElementById("signup-confirm").value;
        const errorMsg = document.getElementById("signup-error");
        errorMsg.textContent = ""; 

        if (password !== confirm) {
            errorMsg.textContent = "Mật khẩu không khớp!";
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            alert("Đăng ký thành công! Chuyển hướng đến Bảng điều khiển.");
            window.location.href = "/html/home.html";
        } catch (error) {
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

// --- 4. Xử lý ĐĂNG NHẬP bằng GOOGLE (Dùng Firebase Auth) ---
if (ggLoginBtn) {
    ggLoginBtn.addEventListener("click", async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert(`Đăng nhập bằng Google thành công!`);
            
            window.location.href = "/html/home.html";
        } catch (error) {
            console.error("Lỗi Đăng nhập Google: ", error);
            document.getElementById("login-error").textContent = "Đăng nhập Google thất bại.";
        }
    });
}