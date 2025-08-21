// Gọi API lấy toàn bộ sản phẩm
let products = [];

fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    products = data.products; // lưu danh sách sản phẩm
    console.log("Danh sách sản phẩm:", products);
  });

// Lấy các phần tử trong DOM
const searchInput = document.querySelector(".search-box input");
const searchBtn = document.querySelector(".search-btn");

// Tạo khung kết quả trong body
const resultsContainer = document.createElement("div");
resultsContainer.classList.add("results");
document.body.appendChild(resultsContainer);

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

    resultsContainer.appendChild(productEl);
  });
}

// Khi bấm nút search
searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase().trim();
  if (!keyword) {
    alert("Vui lòng nhập từ khóa tìm kiếm!");
    return;
  }

  // Lọc sản phẩm theo từ khóa
  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword)
  );

  renderProducts(filtered);
});

// Khi nhấn Enter trong ô search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
