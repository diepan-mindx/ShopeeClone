// Gọi API lấy toàn bộ sản phẩm
let products = [];

// Lấy các phần tử trong DOM
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("results");

// Hàm render sản phẩm ra màn hình
function renderProducts(items) {
  resultsContainer.innerHTML = ""; // xoá kết quả cũ
  if (items.length === 0) {
    resultsContainer.innerHTML = "<p>Không tìm thấy sản phẩm nào.</p>";
    return;
  }

  items.forEach((p) => {
    const productEl = document.createElement("div");
    productEl.classList.add("product");

    productEl.innerHTML = `
      <img src="${p.thumbnail}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
    `;

    // 👉 Khi bấm vào sản phẩm, chuyển sang trang products.html
    productEl.addEventListener("click", () => {
      window.location.href = `products.html?id=${p.id}`;
    });

    resultsContainer.appendChild(productEl);
  });
}

// Khi bấm nút search
searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase().trim();

  // Nếu không có từ khóa, hiển thị tất cả sản phẩm
  if (!keyword) {
    renderProducts(products);
    return;
  }

  // Lọc sản phẩm theo từ khóa (tìm trong tiêu đề và mô tả)
  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(keyword) ||
      (p.description && p.description.toLowerCase().includes(keyword))
  );

  renderProducts(filtered);
});

// Khi nhấn Enter trong ô search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Gọi API và hiển thị tất cả sản phẩm khi trang được tải
fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    products = data.products; // lưu danh sách sản phẩm
    console.log("Danh sách sản phẩm:", products);
    // Hiển thị tất cả sản phẩm khi trang được tải
    renderProducts(products);
  })
  .catch((error) => {
    console.error("Lỗi khi tải sản phẩm:", error);
    resultsContainer.innerHTML =
      "<p>Lỗi khi tải sản phẩm. Vui lòng thử lại sau.</p>";
  });