// donhang.js
import { db } from "./firebase_config.js";
import { 
    collection, getDocs, doc, updateDoc, query, where, orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; 

const orderTableBody = document.getElementById('orderTableBody');
const orderFilter = document.getElementById('orderFilter');
const orderSearch = document.getElementById('orderSearch');

function getStatusText(status) {
    switch(status) {
        case 'pending': return '⏳ Chờ xác nhận';
        case 'shipped': return '🚚 Đang giao';
        case 'done': return '✅ Hoàn thành';
        case 'cancel': return '❌ Đã hủy';
        default: return 'Không xác định';
    }
}

// Hàm tải và render đơn hàng
async function loadOrders(filterStatus = 'all', searchKeyword = '') {
    orderTableBody.innerHTML = '<tr><td colspan="7">Đang tải đơn hàng...</td></tr>';
    
    let ordersCol = collection(db, "orders");
    let filters = [];
    if (filterStatus !== 'all') {
        filters.push(where("status", "==", filterStatus));
    }
    
    let q = query(ordersCol, ...filters, orderBy("orderDate", "desc"));

    try {
        const snapshot = await getDocs(q);
        
        orderTableBody.innerHTML = '';
        if (snapshot.empty) {
            orderTableBody.innerHTML = '<tr><td colspan="7">Không tìm thấy đơn hàng nào.</td></tr>';
            return;
        }

        const keyword = searchKeyword.toLowerCase();

        snapshot.forEach(doc => {
            const data = doc.data();
            
            // Lọc client-side bằng từ khóa tìm kiếm (Tối ưu hóa: Firestore nên làm search bằng các dịch vụ khác)
            if (keyword && !(data.customerName?.toLowerCase().includes(keyword) || doc.id.includes(keyword))) {
                return;
            }

            const row = orderTableBody.insertRow();
            row.innerHTML = `
                <td>${doc.id.substring(0, 8)}...</td>
                <td>${data.customerName || 'Khách hàng ẩn danh'}</td>
                <td>${data.items?.length || 0} sản phẩm</td>
                <td>${new Intl.NumberFormat('vi-VN').format(data.totalPrice || 0)} VND</td>
                <td>${data.orderDate?.toDate().toLocaleDateString('vi-VN') || 'N/A'}</td>
                <td><span class="status-${data.status}">${getStatusText(data.status)}</span></td>
                <td>
                    <select onchange="updateOrderStatus('${doc.id}', this.value)">
                        <option value="pending" ${data.status === 'pending' ? 'selected' : ''}>Chờ xác nhận</option>
                        <option value="shipped" ${data.status === 'shipped' ? 'selected' : ''}>Đang giao</option>
                        <option value="done" ${data.status === 'done' ? 'selected' : ''}>Hoàn thành</option>
                        <option value="cancel" ${data.status === 'cancel' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                </td>
            `;
        });
    } catch (e) {
        console.error("Lỗi tải đơn hàng: ", e);
        orderTableBody.innerHTML = '<tr><td colspan="7">Lỗi tải dữ liệu.</td></tr>';
    }
}

// --- 2. Xử lý cập nhật trạng thái ---
window.updateOrderStatus = async (orderId, newStatus) => {
    try {
        await updateDoc(doc(db, "orders", orderId), {
            status: newStatus,
            updatedAt: new Date()
        });
        alert(`Cập nhật đơn hàng thành ${getStatusText(newStatus)} thành công!`);
        loadOrders(orderFilter.value, orderSearch.value); // Tải lại danh sách
    } catch (e) {
        console.error("Lỗi cập nhật trạng thái đơn hàng: ", e);
        alert("Cập nhật trạng thái thất bại.");
    }
};

// --- 3. Listener cho bộ lọc và tìm kiếm ---
orderFilter.addEventListener('change', () => loadOrders(orderFilter.value, orderSearch.value));
orderSearch.addEventListener('input', () => loadOrders(orderFilter.value, orderSearch.value)); 

// Tải đơn hàng ban đầu
loadOrders();