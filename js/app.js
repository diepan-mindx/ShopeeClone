/* app.js - quản lý chung Admin Panel */

document.addEventListener("DOMContentLoaded", () => {
  const file = location.pathname.split("/").pop() || "home.html";

  // Nếu chưa đăng nhập -> quay lại index.html (bạn bật khi cần)
  if (file !== "index.html" && localStorage.getItem("isLoggedIn") !== "true") {
    // window.location.href = "index.html";
  }

  // Sidebar active link
  setActiveNav(file);

  // Logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  // Khởi tạo chức năng cho từng trang
  initPage(file);
});

/* ================= Helpers ================= */
function setActiveNav(file) {
  document.querySelectorAll(".sidebar a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === file) a.classList.add("active");
    else a.classList.remove("active");
  });
}

function logout() {
  localStorage.setItem("isLoggedIn", "false");
  window.location.href = "index.html";
}

function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, (m) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[m];
  });
}

function formatCurrency(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString("vi-VN") + " ₫" : "-";
}

function sanitizeNumberFromString(str) {
  if (str === null || str === undefined) return 0;
  const digits = String(str).replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function initPage(file) {
  switch (file) {
    case "home.html":
      initHome();
      break;
    case "settings.html":
      initSettings();
      break;
    case "sanpham.html":
      initProducts();
      break;
    case "donhang.html":
      initOrders();
      break;
    case "voucher.html":
      initVouchers();
      break;
    case "ngdung.html":
      initUsers();
      break;
    case "tuchoidonhang.html":
      initRejected();
      break;
    default:
      console.log("No specific JS for this page.");
      break;
  }
}

/* ================= Home ================= */
function initHome() {
  const nameDisplay = document.getElementById("admin-name");
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin" };
  if (nameDisplay) nameDisplay.textContent = user.name;
  console.log("Home dashboard ready.");
}

/* ================= Settings ================= */
function initSettings() {
  const form = document.getElementById("settingsForm");
  if (!form) return;
  const msg = document.getElementById("message");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("password").value = user.password || "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const updatedUser = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    if (msg) msg.style.display = "block";
  });
}

/* ================= Products ================= */
function initProducts() {
  const tbody = document.getElementById("productsTableBody");
  const form = document.getElementById("productForm");
  if (!tbody || !form) return;
  const nameIn = document.getElementById("p_name");
  const priceIn = document.getElementById("p_price");
  const descIn = document.getElementById("p_desc");
  const idIn = document.getElementById("p_id");

  if (!localStorage.getItem("products")) {
    localStorage.setItem(
      "products",
      JSON.stringify([
        { id: 1, name: "Áo phông logo", price: 120000, desc: "Size S-XL" },
        { id: 2, name: "Giày thể thao", price: 850000, desc: "Size 39-44" },
      ])
    );
  }

  function getProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
  }
  function saveProducts(arr) {
    localStorage.setItem("products", JSON.stringify(arr));
  }

  function render() {
    tbody.innerHTML = "";
    getProducts().forEach((p) => {
      tbody.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td>${escapeHtml(p.name)}</td>
          <td>${formatCurrency(p.price)}</td>
          <td>${escapeHtml(p.desc)}</td>
          <td class="actions">
            <button class="btn save-btn" onclick="editProduct(${p.id})">Sửa</button>
            <button class="btn logout-btn" onclick="delProduct(${p.id})">Xóa</button>
          </td>
        </tr>`;
    });
  }

  form.addEventListener("submit", (e) => {
      e.preventDefault();
      let products = getProducts();

      const priceNumber = sanitizeNumberFromString(priceIn.value);
      if (idIn.value) {
        const id = Number(idIn.value);
        products = products.map((p) =>
          p.id === id
            ? { id, name: nameIn.value.trim(), price: priceNumber, desc: descIn.value.trim() }
            : p
        );
      } else {
        const newId = Date.now();
        products.push({
          id: newId,
          name: nameIn.value.trim(),
          price: priceNumber,
          desc: descIn.value.trim(),
        });
      }

      saveProducts(products);
      form.reset();
      idIn.value = "";
      render();
    });

  window.editProduct = (id) => {
    const p = getProducts().find((x) => x.id === id);
    if (!p) return;
    idIn.value = p.id;
    nameIn.value = p.name;
    priceIn.value = p.price;
    descIn.value = p.desc || "";
  };

  window.delProduct = (id) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    const products = getProducts().filter((p) => p.id !== id);
    saveProducts(products);
    render();
  };

  (function normalizeExistingProducts() {
    const arr = getProducts();
    let changed = false;
    const newArr = arr.map((p) => {
      const sanitized = sanitizeNumberFromString(p.price);
      if (sanitized !== Number(p.price)) changed = true;
      return { ...p, price: sanitized };
    });
    if (changed) saveProducts(newArr);
  })();

  render();
}

/* ================= Orders ================= */
function initOrders() {
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  if (!localStorage.getItem("orders")) {
    localStorage.setItem(
      "orders",
      JSON.stringify([
        { id: 1, customer: "Nguyễn Văn A", status: "pending" },
        { id: 2, customer: "Trần Thị B", status: "shipped" },
      ])
    );
  }

  function getOrders() {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  }
  function saveOrders(arr) {
    localStorage.setItem("orders", JSON.stringify(arr));
  }

  function render() {
    tbody.innerHTML = "";
    getOrders().forEach((o) => {
      tbody.innerHTML += `
        <tr>
          <td>${o.id}</td>
          <td>${escapeHtml(o.customer)}</td>
          <td><span class="badge ${o.status}">${o.status}</span></td>
          <td>
            <button class="btn save-btn" onclick="shipOrder(${o.id})">Giao</button>
            <button class="btn logout-btn" onclick="rejectOrder(${o.id})">Hủy</button>
          </td>
        </tr>`;
    });
  }

  window.shipOrder = (id) => {
    let orders = getOrders();
    orders = orders.map((o) => (o.id === id ? { ...o, status: "shipped" } : o));
    saveOrders(orders);
    render();
  };

  window.rejectOrder = (id) => {
    let orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    orders = orders.filter((o) => o.id !== id);
    saveOrders(orders);

    const rej = JSON.parse(localStorage.getItem("rejected") || "[]");
    rej.push({ id: order.id, customer: order.customer, reason: "Khách hủy" });
    localStorage.setItem("rejected", JSON.stringify(rej));

    render();
  };

  render();
}

/* ================= Vouchers ================= */
function initVouchers() {
  const tbody = document.getElementById("voucherTableBody");
  const form = document.getElementById("voucherForm"); 
  const codeIn = form ? document.getElementById("v_code") : null;
  const perIn = form ? document.getElementById("v_percent") : null;
  const oldCodeIn = form ? document.getElementById("v_old_code") : null;
  
  if (!tbody) return;

  if (!localStorage.getItem("vouchers")) {
    localStorage.setItem(
      "vouchers",
      JSON.stringify([
        { code: "SALE10", percent: 10 },
        { code: "FREESHIP", percent: 100 },
      ])
    );
  }

  function getVouchers() {
    return JSON.parse(localStorage.getItem("vouchers") || "[]");
  }
  function saveVouchers(arr) {
    localStorage.setItem("vouchers", JSON.stringify(arr));
  }

  function render() {
    tbody.innerHTML = "";
    getVouchers().forEach((v) => {
      tbody.innerHTML += `
        <tr>
          <td>${escapeHtml(v.code)}</td>
          <td>${v.percent}%</td>
          <td class="actions">
              <button class="btn save-btn" onclick="editVoucher('${v.code}')">Sửa</button>
              <button class="btn logout-btn" onclick="delVoucher('${v.code}')">Xóa</button>
          </td>
        </tr>`;
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let vouchers = getVouchers();
      const newCode = codeIn.value.trim().toUpperCase();
      const newPercent = sanitizeNumberFromString(perIn.value);

      if (!oldCodeIn.value && vouchers.some(v => v.code === newCode)) {
        alert("Mã voucher đã tồn tại. Vui lòng chọn mã khác.");
        return;
      }
      
      if (oldCodeIn.value) {
        const oldCode = oldCodeIn.value;
        vouchers = vouchers.map((v) => 
          v.code === oldCode ? { code: newCode, percent: newPercent } : v
        );
      } else {
        vouchers.push({ code: newCode, percent: newPercent });
      }

      saveVouchers(vouchers);
      form.reset();
      oldCodeIn.value = "";
      render();
    });

    window.editVoucher = (code) => {
        const voucher = getVouchers().find(v => v.code === code);
        if (!voucher) return;
        codeIn.value = voucher.code;
        perIn.value = voucher.percent;
        oldCodeIn.value = voucher.code;
    }
  }

  window.delVoucher = (code) => {
    if (!confirm("Xóa voucher này?")) return;
    let vouchers = getVouchers().filter((v) => v.code !== code);
    saveVouchers(vouchers);
    render();
  };

  render();
}

/* ================= Users ================= */
function initUsers() {
  const tbody = document.getElementById("usersTableBody");
  if (!tbody) return;

  if (!localStorage.getItem("users")) {
    localStorage.setItem(
      "users",
      JSON.stringify([
        { id: 1, name: "Admin", email: "admin@mail.com", role: "Quản trị" },
        { id: 2, name: "User A", email: "usera@mail.com", role: "Khách" },
      ])
    );
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }
  function saveUsers(arr) {
    localStorage.setItem("users", JSON.stringify(arr));
  }

  function render() {
    tbody.innerHTML = "";
    getUsers().forEach((u) => {
      tbody.innerHTML += `
        <tr>
          <td>${u.id}</td>
          <td>${escapeHtml(u.name)}</td>
          <td>${escapeHtml(u.email)}</td>
          <td>${u.role}</td>
          <td><button class="btn logout-btn" onclick="delUser(${u.id})">Xóa</button></td>
        </tr>`;
    });
  }

  window.delUser = (id) => {
    if (!confirm("Xóa người dùng này?")) return;
    let users = getUsers().filter((u) => u.id !== id);
    saveUsers(users);
    render();
  };

  render();
}

/* ================= Rejected Orders ================= */
function initRejected() {
  const tbody = document.getElementById("rejectedTableBody");
  if (!tbody) return;

  function getRejected() {
    return JSON.parse(localStorage.getItem("rejected") || "[]");
  }

  function render() {
    tbody.innerHTML = "";
    getRejected().forEach((r) => {
      tbody.innerHTML += `
        <tr>
          <td>${r.id}</td>
          <td>${escapeHtml(r.customer)}</td>
          <td>${escapeHtml(r.reason)}</td>
        </tr>`;
    });
  }

  render();
}