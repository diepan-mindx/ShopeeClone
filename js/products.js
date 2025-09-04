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
  .then(res => res.json())
  .then(p => {
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

    // Mua ngay
    buyBtn.addEventListener("click", () => {
      alert(`Bạn đã mua ngay sản phẩm: ${p.title}`);
      // sau này có thể redirect sang trang checkout
    });
  })
  .catch(err => {
    console.error("Lỗi:", err);
  });
