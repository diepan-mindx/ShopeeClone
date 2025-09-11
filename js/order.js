document.addEventListener("DOMContentLoaded", () => {
  const orderContainer = document.getElementById("order-container");
  let product = JSON.parse(localStorage.getItem("orderProduct"));

  if (!product) {
    orderContainer.innerHTML = "<p>❌ Không có sản phẩm nào để đặt.</p>";
    return;
  }

  // Nếu chưa có quantity thì gán = 1
  if (!product.quantity) product.quantity = 1;

  function renderOrder() {
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
        </div>
      </div>
    `;

    // Nút tăng
    document.getElementById("increaseBtn").addEventListener("click", () => {
      product.quantity++;
      localStorage.setItem("orderProduct", JSON.stringify(product));
      renderOrder();
    });

    // Nút giảm
    document.getElementById("decreaseBtn").addEventListener("click", () => {
      if (product.quantity > 1) {
        product.quantity--;
        localStorage.setItem("orderProduct", JSON.stringify(product));
        renderOrder();
      }
    });
  }

  renderOrder();

  // Nút đặt hàng
  document.getElementById("confirmOrderBtn").addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Xóa sản phẩm khỏi giỏ
    cart = cart.filter((item) => item.id !== product.id);
    localStorage.setItem("cart", JSON.stringify(cart));

    localStorage.removeItem("orderProduct");

    alert("🎉 Đặt hàng thành công!");
    window.location.href = "inbox.html";
  });
});
