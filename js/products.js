import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

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

    // Thêm vào giỏ (Firestore)
    addCartBtn.addEventListener("click", async () => {
      try {
        const cartCol = collection(db, "cart");
        const q = query(cartCol, where("productId", "==", p.id));
        const snap = await getDocs(q);

        if (!snap.empty) {
          // Đã có trong giỏ -> tăng số lượng
          const existingDoc = snap.docs[0];
          const currentQty = existingDoc.data().quantity || 1;
          await updateDoc(doc(db, "cart", existingDoc.id), { quantity: currentQty + 1 });
        } else {
          // Chưa có -> thêm mới
          await addDoc(cartCol, {
            productId: p.id,
            title: p.title,
            price: p.price,
            thumbnail: p.thumbnail,
            quantity: 1
          });
        }

        alert("Đã thêm vào giỏ hàng!");
      } catch (err) {
        console.error("Lỗi thêm giỏ hàng:", err);
        alert("Có lỗi khi thêm vào giỏ. Vui lòng thử lại.");
      }
    });

    // 👉 Mua ngay
    buyBtn.addEventListener("click", () => {
      // Lưu sản phẩm vào localStorage để order.html đọc lại
      localStorage.setItem("orderProduct", JSON.stringify(p));
      // Chuyển sang trang order.html
      window.location.href = "order.html";
    });
  })
  .catch((err) => {
    console.error("Lỗi:", err);
  });
// Lưu ý: xử lý "Mua ngay" vẫn dùng localStorage để qua trang order.html