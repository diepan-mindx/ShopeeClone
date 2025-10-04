// sanpham.js - Quản lý sản phẩm
import { db } from "./firebase_config.js";
import {
  collection, addDoc, getDocs, doc, deleteDoc, updateDoc,
  query, orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const $ = (id) => document.getElementById(id);
const productForm = $("productForm");

async function loadProducts() {
  const tbody = $("productsTableBody");        // ID đúng với HTML
  if (!tbody) {
    console.error("Không tìm thấy #productsTableBody trong HTML");
    return;
  }

  tbody.innerHTML = `<tr><td colspan="5">Đang tải sản phẩm...</td></tr>`;
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    tbody.innerHTML = "";
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="5">Chưa có sản phẩm nào.</td></tr>`;
      return;
    }

    snap.forEach((docSnap) => {
      const p = docSnap.data();
      const tr = tbody.insertRow();
      tr.innerHTML = `
        <td>${docSnap.id}</td>
        <td>${p.name || ""}</td>
        <td>${new Intl.NumberFormat("vi-VN").format(p.price || 0)} VND</td>
        <td>${p.description || ""}</td>
        <td>
          <button class="btn btn-secondary"
            onclick="editProduct('${docSnap.id}', '${(p.name || "").replace(/'/g, "\\'")}', ${p.price || 0}, '${(p.description || "").replace(/'/g, "\\'")}')">Sửa</button>
          <button class="btn btn-danger" onclick="deleteProduct('${docSnap.id}')">Xóa</button>
        </td>`;
    });
  } catch (e) {
    console.error("Lỗi tải sản phẩm:", e);
    tbody.innerHTML = `<tr><td colspan="5">Lỗi tải dữ liệu.</td></tr>`;
  }
}

// Expose các hàm để dùng trong onclick
window.editProduct = (id, name, price, desc) => {
  $("p_id").value = id;
  $("p_name").value = name;
  $("p_price").value = price;
  $("p_desc").value = desc;
  document.querySelector(".btn-primary").textContent = "Cập nhật sản phẩm";
};

window.deleteProduct = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
  try {
    await deleteDoc(doc(db, "products", id));
    alert("Đã xóa!");
    loadProducts();
  } catch (e) {
    console.error("Lỗi xóa:", e);
    alert("Xóa thất bại.");
  }
};

// Submit form: thêm / cập nhật
if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = $("p_id").value.trim();
    const name = $("p_name").value.trim();
    const price = parseFloat($("p_price").value);
    const desc = $("p_desc").value.trim();

    if (!name) return alert("Tên không được trống.");
    if (Number.isNaN(price) || price < 0) return alert("Giá không hợp lệ.");

    try {
      if (id) {
        await updateDoc(doc(db, "products", id), { name, price, description: desc });
        alert("Cập nhật thành công!");
      } else {
        await addDoc(collection(db, "products"), { name, price, description: desc, createdAt: new Date() });
        alert("Thêm thành công!");
      }
      productForm.reset();
      $("p_id").value = "";
      document.querySelector(".btn-primary").textContent = "Lưu sản phẩm";
      loadProducts();
    } catch (e) {
      console.error("Lỗi lưu:", e);
      alert("Thao tác thất bại.");
    }
  });
}

// Đảm bảo chạy sau khi DOM sẵn sàng (phòng trường hợp script không ở cuối body)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProducts);
} else {
  loadProducts();
}
