import { db } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const cartContainer = document.getElementById("cart-container");
const cartRef = collection(db, "cart");
const buyAllBtn = document.getElementById("buy-all-btn");
const buyAllModal = document.getElementById("buy-all-modal");
const orderListEl = document.getElementById("order-list");
const grandTotalEl = document.getElementById("grand-total");
const closeBuyAllBtn = document.getElementById("close-buy-all");
const confirmBuyAllBtn = document.getElementById("confirm-buy-all");

// 🔹 Lấy giỏ hàng từ Firestore
async function getCart() {
  const snapshot = await getDocs(cartRef);
  return snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
}

// 🔹 Render giỏ hàng
async function renderCart() {
  let cart = await getCart();
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>🛒 Giỏ hàng trống</p>";
    return;
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}">
      <div class="cart-info">
        <h3>${item.title}</h3>
        <p>Giá: $${item.price} x ${item.quantity} = <strong>$${item.price * item.quantity
      }</strong></p>
        <button class="remove-btn">Xóa</button>
        <button class="buy-btn">Mua ngay</button>
      </div>
    `;

    // ❌ Xóa khỏi Firebase
    div.querySelector(".remove-btn").addEventListener("click", async () => {
      await deleteDoc(doc(db, "cart", item.docId));
      renderCart();
    });

    // ✅ Mua ngay
    div.querySelector(".buy-btn").addEventListener("click", () => {
      localStorage.setItem("orderProduct", JSON.stringify(item));
      window.location.href = "order.html";
    });

    cartContainer.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", renderCart);

// 🔹 Mua tất cả: mở modal, liệt kê từng đơn và tính tổng
async function openBuyAllModal() {
  const cart = await getCart();
  if (!cart || cart.length === 0) {
    alert("🛒 Giỏ hàng trống");
    return;
  }

  orderListEl.innerHTML = "";

  let total = 0;
  cart.forEach((item) => {
    const qty = item.quantity || 1;
    const subtotal = (Number(item.price) || 0) * qty;
    total += subtotal;

    const row = document.createElement("div");
    row.className = "order-row";
    row.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}">
      <div class="meta">
        <div><strong>${item.title}</strong></div>
        <div>Giá: $${item.price} x ${qty}</div>
      </div>
      <div class="price">$${subtotal}</div>
    `;
    orderListEl.appendChild(row);
  });

  grandTotalEl.textContent = total;
  buyAllModal.classList.remove("hidden");
}

function closeBuyAllModal() {
  buyAllModal.classList.add("hidden");
}

// 🔹 Xác nhận mua tất cả: xoá toàn bộ item trong Firestore và refresh
async function confirmBuyAll() {
  const cart = await getCart();
  if (!cart || cart.length === 0) {
    closeBuyAllModal();
    return;
  }

  const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);

  await Promise.all(
    cart.map((item) => deleteDoc(doc(db, "cart", item.docId)))
  );

  alert(`🎉 Mua tất cả thành công! Tổng thanh toán: $${total}`);
  closeBuyAllModal();
  renderCart();
}

// Gắn sự kiện cho các nút modal
if (buyAllBtn) buyAllBtn.addEventListener("click", openBuyAllModal);
if (closeBuyAllBtn) closeBuyAllBtn.addEventListener("click", closeBuyAllModal);
if (confirmBuyAllBtn) confirmBuyAllBtn.addEventListener("click", confirmBuyAll);