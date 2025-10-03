// home.js
import { db } from "./firebase_config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; 

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN').format(value || 0) + ' VND';
const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(value || 0);

async function loadDashboardStats() {
    try {
        // Tổng sản phẩm
        const productSnapshot = await getDocs(collection(db, "products"));
        document.querySelector('.stat-products .stat').textContent = formatNumber(productSnapshot.size);

        // Tổng đơn hàng
        const orderSnapshot = await getDocs(collection(db, "orders"));
        document.querySelector('.stat-orders .stat').textContent = formatNumber(orderSnapshot.size);

        // Doanh thu (Đơn hàng đã hoàn thành)
        const doneOrdersQuery = query(
            collection(db, "orders"),
            where("status", "==", "done")
        );
        let totalRevenue = 0;
        const doneOrdersSnapshot = await getDocs(doneOrdersQuery);
        doneOrdersSnapshot.forEach(doc => {
            totalRevenue += (doc.data().totalPrice || 0); 
        });
        document.querySelector('.stat-revenue .stat').textContent = formatCurrency(totalRevenue);

        // Tổng người dùng (từ collection 'users' nếu có)
        const userSnapshot = await getDocs(collection(db, "users")); 
        document.querySelector('.stat-users .stat').textContent = formatNumber(userSnapshot.size);

    } catch (e) {
        console.error("Lỗi tải thống kê Dashboard: ", e);
        document.querySelectorAll('.stat').forEach(el => el.textContent = 'Lỗi');
    }
}

loadDashboardStats();