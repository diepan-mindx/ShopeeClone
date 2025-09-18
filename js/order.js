import { db, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const orderContainer = document.getElementById("order-container");

  async function init(user) {
    const isLoggedIn = !!user;
    const draftRef = isLoggedIn ? doc(db, "orderDrafts", user.uid) : null;
    let product = null;

    if (isLoggedIn) {
      try {
        const snap = await getDoc(draftRef);
        product = snap.exists() ? snap.data() : null;
      } catch (e) {
        console.error("[order] Lỗi đọc draft Firestore:", e);
      }
      // Fallback: nếu chưa có draft nhưng localStorage có thì dùng
      if (!product) {
        const local = JSON.parse(localStorage.getItem("orderProduct"));
        if (local) product = local;
      }
    } else {
      product = JSON.parse(localStorage.getItem("orderProduct"));
    }

    console.log("[order] isLoggedIn=", isLoggedIn, " product=", product);

    if (!product) {
      // window.location.href = "../pages/shop.html";
      return;
    }

    if (!product.quantity) product.quantity = 1;

    function renderOrder() {
    orderContainer.innerHTML = `
      <div class="order-item">
        <img src="${product.thumbnail}" alt="${product.title
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
        </div>
      </div>
    `;

    // Nút tăng
    document.getElementById("increaseBtn").addEventListener("click", async () => {
      product.quantity++;
      if (isLoggedIn) {
        try { await setDoc(draftRef, product); } catch (e) { console.error("[order] Lỗi cập nhật draft +:", e); }
      } else {
        localStorage.setItem("orderProduct", JSON.stringify(product));
      }
      renderOrder();
    });

    // Nút giảm
    document.getElementById("decreaseBtn").addEventListener("click", async () => {
      if (product.quantity > 1) {
        product.quantity--;
        if (isLoggedIn) {
          try { await setDoc(draftRef, product); } catch (e) { console.error("[order] Lỗi cập nhật draft -:", e); }
        } else {
          localStorage.setItem("orderProduct", JSON.stringify(product));
        }
        renderOrder();
      }
    });

    renderOrder();

    // Nút đặt hàng
    document.getElementById("confirmOrderBtn").addEventListener("click", async () => {
      if (isLoggedIn) {
        try { await deleteDoc(draftRef); } catch (e) { console.error("[order] Lỗi xoá draft khi xác nhận:", e); }
      } else {
        // Xoá sản phẩm khỏi giỏ localStorage (nếu có) và dọn orderProduct
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter((item) => item.id !== product.id);
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.removeItem("orderProduct");
      }
      alert("🎉 Đặt hàng thành công!");
      window.location.href = "../pages/shop.html";
    });
  }

  // Quan sát trạng thái đăng nhập (auth.currentUser có thể null ở lần load đầu)
  onAuthStateChanged(auth, (user) => {
    init(user);
  });
}});
