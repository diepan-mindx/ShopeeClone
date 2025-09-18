import { db, auth } from "./firebase-config.js";
import { collection, getDocs, query, where, addDoc, updateDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const cartRef = collection(db, "cart");

// Lấy id từ URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// DOM elements
const img = document.getElementById("productImg");
const title = document.getElementById("productTitle");
const desc = document.getElementById("productDesc");
const price = document.getElementById("productPrice");
const addCartBtn = document.getElementById("addCartBtn");
const buyBtn = document.getElementById("buyBtn");

// Lấy chi tiết sản phẩm
fetch(`https://dummyjson.com/products/${id}`)
  .then((res) => res.json())
  .then((p) => {
    img.src = p.thumbnail;
    img.alt = p.title;
    title.textContent = p.title;
    desc.textContent = p.description;
    price.textContent = `$${p.price}`;

    // Thêm vào giỏ (Firestore-only)
    addCartBtn.addEventListener("click", async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
        window.location.href = "login.html";
        return;
      }

      const q = query(cartRef, where("productId", "==", p.id), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const item = snapshot.docs[0];
        const itemRef = doc(db, "cart", item.id);
        const currentQty = item.data().quantity || 1;
        await updateDoc(itemRef, { quantity: currentQty + 1 });
      } else {
        await addDoc(cartRef, {
          uid: user.uid,
          productId: p.id,
          title: p.title,
          price: p.price,
          thumbnail: p.thumbnail,
          quantity: 1,
        });
      }

      alert("✅ Đã thêm sản phẩm vào giỏ hàng!");
    });

    // 👉 Mua ngay (ưu tiên Firestore, fallback localStorage)
    buyBtn.addEventListener("click", async () => {
      const user = auth.currentUser;
      if (!user) {
        localStorage.setItem("orderProduct", JSON.stringify({
          id: p.id,
          title: p.title,
          price: p.price,
          thumbnail: p.thumbnail,
          description: p.description,
          quantity: 1,
        }));
        window.location.href = ("../pages/order.html");
        return;
      }

      await setDoc(doc(db, "orderDrafts", user.uid), {
        uid: user.uid,
        productId: p.id,
        title: p.title,
        price: p.price,
        thumbnail: p.thumbnail,
        description: p.description,
        quantity: 1,
      });
      window.location.href = ("../pages/order.html");
    });
  })
  .catch((err) => {
    console.error("Lỗi:", err);
  });
