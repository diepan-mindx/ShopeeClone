// tuchoidonhang.js
import { db } from "./firebase_config.js";
import { 
    collection, getDocs, query, where, orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; 

const rejectedTableBody = document.getElementById('rejectedTableBody'); // Cần thêm id này vào thẻ <tbody>

async function loadRejectedOrders() {
    rejectedTableBody.innerHTML = '<tr><td colspan="5">Đang tải đơn hàng bị từ chối...</td></tr>';
    
    let ordersCol = collection(db, "orders");
    // Lọc các đơn hàng có trạng thái là 'cancel' (hoặc 'rejected' nếu bạn dùng)
    let q = query(ordersCol, where("status", "==", "cancel"), orderBy("orderDate", "desc"));

    try {
        const snapshot = await getDocs(q);
        
        rejectedTableBody.innerHTML = '';
        if (snapshot.empty) {
            rejectedTableBody.innerHTML = '<tr><td colspan="5">Không có đơn hàng nào bị hủy/từ chối.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            
            const row = rejectedTableBody.insertRow();
            row.innerHTML = `
                <td>${doc.id.substring(0, 8)}...</td>
                <td>${data.customerName || 'Khách hàng ẩn danh'}</td>
                <td>${new Intl.NumberFormat('vi-VN').format(data.totalPrice || 0)} VND</td>
                <td>${data.orderDate?.toDate().toLocaleDateString('vi-VN') || 'N/A'}</td>
                <td>${data.reason || 'Không rõ lý do'}</td>
            `;
        });
    } catch (e) {
        console.error("Lỗi tải đơn hàng bị từ chối: ", e);
        rejectedTableBody.innerHTML = '<tr><td colspan="5">Lỗi tải dữ liệu.</td></tr>';
    }
}

loadRejectedOrders();