// ngdung.js (Logic Quản lý Người dùng) - phiên bản có nút Đặt/Thu hồi Admin
import { db } from "./firebase_config.js";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; 

// đảm bảo id trùng với HTML: <tbody id="usersTableBody"></tbody>
const userTableBody = document.getElementById('userTableBody');

async function loadUsers() {
    // hiển thị loading
    userTableBody.innerHTML = '<tr><td colspan="5">Đang tải người dùng...</td></tr>';
    try {
        const snapshot = await getDocs(collection(db, "users"));
        
        userTableBody.innerHTML = '';
        if (snapshot.empty) {
            userTableBody.innerHTML = '<tr><td colspan="5">Chưa có người dùng nào được lưu.</td></tr>';
            return;
        }

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const id = docSnap.id;
            // tạo row
            const row = userTableBody.insertRow();
            // cột ID (hiện 'Chưa cập nhật' nếu không có), Tên, Email, Vai trò, Hành động
            row.innerHTML = `
                <td>${data.displayName || 'Chưa cập nhật'}</td>
                <td>${data.email || 'N/A'}</td>
                <td class="role-cell">${data.role || 'user'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="toggleAdmin('${id}', '${data.role || 'user'}')">
                        ${data.role === 'admin' ? 'Thu hồi Admin' : 'Đặt Admin'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${id}')">Xóa</button>
                </td>
            `;
        });
    } catch (e) {
        console.error("Lỗi tải người dùng: ", e);
        userTableBody.innerHTML = '<tr><td colspan="5">Lỗi tải dữ liệu.</td></tr>';
    }
}

// Hàm chuyển role user <-> admin
window.toggleAdmin = async (userId, currentRole) => {
    const willMakeAdmin = currentRole !== 'admin';
    const confirmMsg = willMakeAdmin 
        ? "Bạn có chắc chắn muốn đặt quyền ADMIN cho tài khoản này?" 
        : "Bạn có chắc chắn muốn thu hồi quyền ADMIN của tài khoản này?";
    if (!confirm(confirmMsg)) return;

    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            role: willMakeAdmin ? 'admin' : 'user',
            updatedAt: new Date()
        });
        alert(`Cập nhật vai trò thành công: ${willMakeAdmin ? 'admin' : 'user'}`);
        // refresh danh sách
        loadUsers();
    } catch (e) {
        console.error("Lỗi cập nhật vai trò: ", e);
        alert("Cập nhật vai trò thất bại. Kiểm tra console.");
    }
};

window.deleteUser = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này khỏi Firestore?")) return;
    try {
        await deleteDoc(doc(db, "users", id));
        alert("Xóa người dùng thành công!");
        loadUsers();
    } catch (e) {
        console.error("Lỗi xóa người dùng: ", e);
        alert("Xóa thất bại!");
    }
};

// khởi tạo
loadUsers();
