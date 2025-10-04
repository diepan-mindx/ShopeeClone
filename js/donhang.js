// donhang.js — hiển thị chính xác đơn hàng Firestore của bạn
import { db } from "./firebase_config.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const orderTableBody = document.getElementById("orderTableBody");
const orderFilter = document.getElementById("orderFilter");
const orderSearch = document.getElementById("orderSearch");

function getStatusText(status) {
  switch (status) {
    case "pending": return "⏳ Chờ xác nhận";
    case "shipped": return "🚚 Đang giao";
    case "done": return "✅ Hoàn thành";
    case "cancel": return "❌ Đã hủy";
    default: return status || "Không xác định";
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatFullDate(dateObj) {
  if (!dateObj) return "N/A";
  const d = new Date(dateObj);
  if (isNaN(d)) return "N/A";
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Lấy tên khách hàng từ uid (nếu có collection users)
async function getUserName(uid) {
  if (!uid) return "Khách chưa đăng nhập";
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return uid;
    const data = snap.data();
    return data.displayName || data.name || data.email || uid;
  } catch {
    return uid;
  }
}

async function loadOrders(filterStatus = "all", searchKeyword = "") {
  orderTableBody.innerHTML = "<tr><td colspan='7'>Đang tải dữ liệu...</td></tr>";

  try {
    const ordersCol = collection(db, "orders");
    const filters = [];
    if (filterStatus !== "all") {
      filters.push(where("status", "==", filterStatus));
    }

    const q = query(ordersCol, ...filters);
    const snapshot = await getDocs(q);
    orderTableBody.innerHTML = "";

    if (snapshot.empty) {
      orderTableBody.innerHTML = "<tr><td colspan='7'>Không có đơn hàng nào.</td></tr>";
      return;
    }

    const keyword = searchKeyword.toLowerCase();

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      // Lọc tìm kiếm theo tên sản phẩm hoặc id
      if (keyword && !(data.title?.toLowerCase().includes(keyword) || docSnap.id.includes(keyword))) {
        continue;
      }

      // Tên sản phẩm
      const title = data.title || "Sản phẩm không tên";

      // Ngày đặt (createdAt)
      let createdAt = "N/A";
      if (data.createdAt) {
        if (data.createdAt.toDate) {
          createdAt = formatFullDate(data.createdAt.toDate());
        } else if (data.createdAt.seconds) {
          createdAt = formatFullDate(new Date(data.createdAt.seconds * 1000));
        }
      }

      // Tổng tiền
      const totalPrice = data.total || (data.price || 0) * (data.quantity || 1);
      const totalText = new Intl.NumberFormat("vi-VN").format(totalPrice) + " VND";

      // Người mua (từ uid)
      const buyerName = await getUserName(data.uid);

      // Render hàng
      const row = orderTableBody.insertRow();
      row.innerHTML = `
        <td>${docSnap.id.substring(0, 8)}...</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px; justify-content:center;">
            <img src="${data.thumbnail || ''}" alt="thumb" width="40" height="40" style="border-radius:6px;object-fit:cover;">
            <span>${escapeHtml(title)}</span>
          </div>
        </td>
        <td>${(data.quantity || 1)} sản phẩm</td>
        <td>${totalText}</td>
        <td>${createdAt}</td>
        <td><span class="status-${data.status}">${getStatusText(data.status)}</span></td>
        <td>
          <div>${escapeHtml(buyerName)}</div>
          <select onchange="updateOrderStatus('${docSnap.id}', this.value)">
            <option value="pending" ${data.status === "pending" ? "selected" : ""}>Chờ xác nhận</option>
            <option value="shipped" ${data.status === "shipped" ? "selected" : ""}>Đang giao</option>
            <option value="done" ${data.status === "done" ? "selected" : ""}>Hoàn thành</option>
            <option value="cancel" ${data.status === "cancel" ? "selected" : ""}>Đã hủy</option>
          </select>
        </td>
      `;
    }
  } catch (e) {
    console.error("❌ Lỗi tải đơn hàng:", e);
    orderTableBody.innerHTML = "<tr><td colspan='7'>Không thể tải dữ liệu Firestore.</td></tr>";
  }
}

// Cập nhật trạng thái
window.updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus, updatedAt: new Date() });
    alert(`✅ Đã cập nhật đơn ${orderId.substring(0,8)}... thành ${getStatusText(newStatus)}`);
    loadOrders(orderFilter.value, orderSearch.value);
  } catch (e) {
    console.error("❌ Lỗi cập nhật:", e);
    alert("Cập nhật thất bại!");
  }
};

orderFilter.addEventListener("change", () => loadOrders(orderFilter.value, orderSearch.value));
orderSearch.addEventListener("input", () => loadOrders(orderFilter.value, orderSearch.value));

loadOrders();
