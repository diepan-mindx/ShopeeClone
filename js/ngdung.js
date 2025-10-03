// ngdung.js (Logic Quản lý Người dùng)
import { db } from "./firebase_config.js";
import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; 

const userTableBody = document.getElementById('userTableBody'); // Cần thêm id này vào thẻ <tbody> trong ngdung.html

async function loadUsers() {
    userTableBody.innerHTML = '<tr><td colspan="4">Đang tải người dùng...</td></tr>';
    try {
        // Lấy danh sách người dùng từ collection "users"
        const snapshot = await getDocs(collection(db, "users"));
        
        userTableBody.innerHTML = '';
        if (snapshot.empty) {
            userTableBody.innerHTML = '<tr><td colspan="4">Chưa có người dùng nào được lưu.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const row = userTableBody.insertRow();
            row.innerHTML = `
                <td>${data.displayName || 'Chưa cập nhật'}</td>
                <td>${data.email || 'N/A'}</td>
                <td>${data.role || 'user'}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteUser('${doc.id}')">Xóa</button>
                </td>
            `;
        });
    } catch (e) {
        console.error("Lỗi tải người dùng: ", e);
        userTableBody.innerHTML = '<tr><td colspan="4">Lỗi tải dữ liệu.</td></tr>';
    }
}

window.deleteUser = async (id) => {
    // ... logic xóa người dùng (đã có trong câu trả lời trước)
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này khỏi Firestore?")) return;
    try {
        await deleteDoc(doc(db, "users", id));
        alert("Xóa người dùng thành công (khỏi Firestore)!");
        loadUsers();
    } catch (e) {
        console.error("Lỗi xóa người dùng: ", e);
        alert("Xóa thất bại!");
    }
};

loadUsers();