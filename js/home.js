// home.js
import { db } from "./firebase_config.js";
import { 
    collection, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; 

// Định dạng tiền tệ và số
const formatCurrency = (value) => new Intl.NumberFormat('vi-VN').format(value || 0) + ' VND';
const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(value || 0);

async function loadDashboardStats() {
    try {
        // 1. Tổng sản phẩm (collection: products)
        const productSnapshot = await getDocs(collection(db, "products"));
        document.querySelector('.stat-products .stat').textContent = formatNumber(productSnapshot.size);

        // 2. Tổng đơn hàng (collection: orders)
        const orderSnapshot = await getDocs(collection(db, "orders"));
        document.querySelector('.stat-orders .stat').textContent = formatNumber(orderSnapshot.size);

        // 3. Doanh thu (Tính tổng giá trị của các đơn hàng đã 'done')
        const doneOrdersQuery = query(
            collection(db, "orders"),
            where("status", "==", "done")
        );
        
        let totalRevenue = 0;
        const doneOrdersSnapshot = await getDocs(doneOrdersQuery);
        doneOrdersSnapshot.forEach(doc => {
            const data = doc.data();
            // Giả định trường giá trị đơn hàng là totalPrice
            totalRevenue += (data.totalPrice || 0); 
        });
        document.querySelector('.stat-revenue .stat').textContent = formatCurrency(totalRevenue);

        // 4. Người dùng (collection: users - nếu bạn lưu vào Firestore)
        const userSnapshot = await getDocs(collection(db, "users")); 
        document.querySelector('.stat-users .stat').textContent = formatNumber(userSnapshot.size);

    } catch (e) {
        console.error("Lỗi tải thống kê Dashboard: ", e);
        document.querySelectorAll('.stat').forEach(el => el.textContent = 'Lỗi');
    }
}

loadDashboardStats();