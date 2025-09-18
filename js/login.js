import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const backBtn = document.getElementById("backBtn");


if (signUpButton) {
  signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });
}

if (signInButton) {
  signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });
}

if (backBtn) {
  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.history.back();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const signUpForm = document.querySelector(".sign-up-container form");
  const signInForm = document.querySelector(".sign-in-container form");

  // Xử lý Sign Up với Firebase Auth + lưu profile Firestore (doc id = UID)
  if (signUpForm) {
    signUpForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = signUpForm.querySelector('input[placeholder="Name"]').value.trim();
      const email = signUpForm.querySelector('input[placeholder="Email"]').value.trim();
      const password = signUpForm.querySelector('input[placeholder="Password"]').value.trim();

      if (!name || !email || !password) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        // Ghi hồ sơ người dùng vào Firestore, doc id = uid
        await setDoc(doc(db, "users", uid), {
          uid,
          name,
          email,
          joinDate: new Date().toISOString(),
          profilePicture: "../user.png",
        });

        // Lưu 1 bản vào localStorage cho UI hiện tại dùng
        localStorage.setItem("currentUser", JSON.stringify({ uid, name, email, profilePicture: "../user.png" }));
        localStorage.setItem("isLoggedIn", "true");

        alert("Đăng ký thành công!");
        window.location.href = "shop.html";
      } catch (err) {
        console.error(err);
        alert(err.message || "Đăng ký thất bại");
      }
    });
  }

  // Xử lý Sign In với Firebase Auth + đồng bộ profile từ Firestore
  if (signInForm) {
    signInForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = signInForm.querySelector('input[placeholder="Email"]').value.trim();
      const password = signInForm.querySelector('input[placeholder="Password"]').value.trim();

      if (!email || !password) {
        alert("Vui lòng nhập email và mật khẩu!");
        return;
      }

      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        // Lấy hồ sơ từ Firestore, nếu chưa có thì tạo tối thiểu
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);
        let profile;
        if (snap.exists()) {
          profile = snap.data();
        } else {
          profile = { uid, name: "", email, joinDate: new Date().toISOString(), profilePicture: "../user.png" };
          await setDoc(userRef, profile);
        }

        localStorage.setItem("currentUser", JSON.stringify(profile));
        localStorage.setItem("isLoggedIn", "true");

        alert("Đăng nhập thành công!");
        window.location.href = "../index.html";
      } catch (err) {
        console.error(err);
        alert(err.message || "Đăng nhập thất bại");
      }
    });
  }
});
