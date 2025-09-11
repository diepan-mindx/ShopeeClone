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

    // Thêm vào giỏ
    addCartBtn.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(p);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Đã thêm vào giỏ hàng!");
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

// Thêm vào giỏ
addCartBtn.addEventListener("click", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Kiểm tra sản phẩm đã có chưa
  let existing = cart.find((item) => item.id === p.id);
  if (existing) {
    existing.quantity += 1; // tăng số lượng
  } else {
    p.quantity = 1; // lần đầu thì set = 1
    cart.push(p);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Đã thêm vào giỏ hàng!");
});
