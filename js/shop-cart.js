import { db } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const cartContainer = document.getElementById("cart-container");
const cartRef = collection(db, "cart");

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
        <p>Giá: $${item.price} x ${item.quantity} = <strong>$${
      item.price * item.quantity
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
