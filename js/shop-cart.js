import { db, auth } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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
        <p>Giá: $${item.price} x ${item.quantity} = <strong>$${item.price * item.quantity}</strong></p>
        <button class="decrease-btn">➖</button>
        <button class="increase-btn">➕</button>
        <button class="remove-btn">❌ Xóa</button>
        <button class="buy-btn">💳 Mua ngay</button>
      </div>
    `;

    // ➖ Giảm số lượng
    div.querySelector(".decrease-btn").addEventListener("click", async () => {
      if (item.quantity > 1) {
        await updateDoc(doc(db, "cart", item.docId), { quantity: item.quantity - 1 });
      } else {
        await deleteDoc(doc(db, "cart", item.docId)); // nếu = 0 thì xoá
      }
      renderCart();
    });

    // ➕ Tăng số lượng
    div.querySelector(".increase-btn").addEventListener("click", async () => {
      await updateDoc(doc(db, "cart", item.docId), { quantity: item.quantity + 1 });
      renderCart();
    });

    // ❌ Xóa khỏi Firebase
    div.querySelector(".remove-btn").addEventListener("click", async () => {
      await deleteDoc(doc(db, "cart", item.docId));
      alert("🗑️ Đã xóa sản phẩm khỏi giỏ");
      renderCart();
    });

    // ✅ Mua ngay (ưu tiên Firestore, fallback localStorage)
    div.querySelector(".buy-btn").addEventListener("click", async () => {
      const user = auth.currentUser;
      if (!user) {
        localStorage.setItem("orderProduct", JSON.stringify({
          id: item.productId || item.id,
          title: item.title,
          price: item.price,
          thumbnail: item.thumbnail,
          description: item.description || "",
          quantity: item.quantity || 1,
        }));
        window.location.href = "../pages/order.html";
        return;
      }
      await setDoc(doc(db, "orderDrafts", user.uid), {
        uid: user.uid,
        productId: item.productId || item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        description: item.description || "",
        quantity: item.quantity || 1,
      });
      window.location.href = ("../pages/order.html");
    });

    cartContainer.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", renderCart);
