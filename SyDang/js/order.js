import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const orderContainer = document.getElementById("order-container");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("⚠️ Vui lòng đăng nhập để đặt hàng.");
      window.location.href = "login.html";
      return;
    }

    const draftRef = doc(db, "orderDrafts", user.uid);
    let product = null;

    try {
      const snap = await getDoc(draftRef);
      product = snap.exists() ? snap.data() : null;
      console.log(product);
    } catch (e) {
      console.error("[order] Lỗi đọc draft Firestore:", e);
    }

    if (!product) {
      window.location.href = "../pages/shop.html";
      return;
    }

    renderOrder(product, draftRef, user);
  });

  // Render UI
  function renderOrder(product, draftRef, user) {
    if (!product.quantity) product.quantity = 1;

    orderContainer.innerHTML = `
      <div class="order-item">
        <img src="${product.thumbnail}" alt="${
      product.title
    }" style="max-width:200px;">
        <div class="order-info">
          <h2>${product.title}</h2>
          <p><strong>Giá 1 sp:</strong> $${product.price}</p>
          <p>
            <strong>Số lượng:</strong>
            <button id="decreaseBtn">-</button>
            <span id="qty">${product.quantity}</span>
            <button id="increaseBtn">+</button>
          </p>
          <p><strong>Tổng:</strong> $${product.price * product.quantity}</p>
          <p><strong>Mô tả:</strong> ${product.description}</p>
          <button id="confirmOrderBtn">✅ Xác nhận đặt hàng</button>
        </div>
      </div>
    `;

    // ➕ Tăng
    document
      .getElementById("increaseBtn")
      .addEventListener("click", async () => {
        product.quantity++;
        await setDoc(draftRef, product);
        renderOrder(product, draftRef, user);
      });

    // ➖ Giảm
    document
      .getElementById("decreaseBtn")
      .addEventListener("click", async () => {
        if (product.quantity > 1) {
          product.quantity--;
          await setDoc(draftRef, product);
          renderOrder(product, draftRef, user);
        }
      });

    // ✅ Xác nhận đặt hàng
    document
      .getElementById("confirmOrderBtn")
      .addEventListener("click", async () => {
        try {
          // 1. Xoá draft
          await deleteDoc(draftRef);

          // 2. Nếu có docId thì xoá khỏi cart
          // if (product.productId) {
          //   await deleteDoc(doc(db, "cart", product.productId));
          // }

          // 3. Lưu vào orders
          await addDoc(collection(db, "orders"), {
            uid: user.uid,
            productId: product.productId,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            description: product.description || "",
            quantity: product.quantity,
            total: product.price * product.quantity,
            status: "pending",
            createdAt: serverTimestamp(),
          });

          alert("🎉 Đặt hàng thành công!");
          window.location.href = "../pages/shop.html";
        } catch (e) {
          console.error("[order] Lỗi khi xác nhận đơn:", e);
          alert("❌ Có lỗi xảy ra khi đặt hàng!");
        }
      });
  }
});
