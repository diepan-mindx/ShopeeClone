// home.js
import { db } from "./firebase_config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"; 

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN').format(value || 0) + ' VND';
const formatNumber = (value) =>
  new Intl.NumberFormat('vi-VN').format(value || 0);

async function loadDashboardStats() {
  try {
    // --- 1. Tổng sản phẩm (API DummyJSON) ---
    const productRes = await fetch("https://dummyjson.com/products");
    const productData = await productRes.json();
    const totalProducts = productData.products?.length || 0;
    document.querySelector('.stat-products .stat').textContent = formatNumber(totalProducts);

    // --- 2. Tổng người dùng (Firestore) ---
    const userSnapshot = await getDocs(collection(db, "users"));
    document.querySelector('.stat-users .stat').textContent = formatNumber(userSnapshot.size);

    // --- 3. Tổng đơn hàng (Firestore) ---
    const orderSnapshot = await getDocs(collection(db, "orders"));
    document.querySelector('.stat-orders .stat').textContent = formatNumber(orderSnapshot.size);

    // --- 4. Doanh thu (chỉ tính đơn có status == "done") ---
    let totalRevenue = 0;
    orderSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === "done") {
        const orderTotal =
          data.total ??
          (data.price && data.quantity ? data.price * data.quantity : 0);
        totalRevenue += orderTotal;
      }
    });

    document.querySelector('.stat-revenue .stat').textContent = formatCurrency(totalRevenue);

  } catch (e) {
    console.error("Lỗi tải thống kê Dashboard: ", e);
    document.querySelectorAll('.stat').forEach(el => el.textContent = 'Lỗi');
  }
}

loadDashboardStats();
