// voucher.js
import { db } from "./firebase_config.js";
import { 
    collection, addDoc, getDocs, doc, deleteDoc, updateDoc,
    query, where
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; 

const voucherForm = document.getElementById('voucherForm');
const voucherTableBody = document.getElementById('voucherTableBody');

// --- 1. Load và Render danh sách voucher ---
async function loadVouchers() {
    voucherTableBody.innerHTML = '<tr><td colspan="3">Đang tải voucher...</td></tr>';
    try {
        const snapshot = await getDocs(collection(db, "vouchers"));
        
        voucherTableBody.innerHTML = '';
        if (snapshot.empty) {
            voucherTableBody.innerHTML = '<tr><td colspan="3">Chưa có mã voucher nào.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const row = voucherTableBody.insertRow();
            row.innerHTML = `
                <td>${data.code}</td>
                <td>${data.percent}%</td>
                <td>
                    <button class="btn btn-secondary" onclick="editVoucher('${data.code}', ${data.percent})">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteVoucher('${data.code}')">Xóa</button>
                </td>
            `;
        });
    } catch (e) {
        console.error("Lỗi tải voucher: ", e);
        voucherTableBody.innerHTML = '<tr><td colspan="3">Lỗi tải dữ liệu.</td></tr>';
    }
}

// Hàm được gọi khi nhấn Sửa
window.editVoucher = (code, percent) => {
    document.getElementById('v_old_code').value = code; // Lưu mã cũ để update
    document.getElementById('v_code').value = code;
    document.getElementById('v_percent').value = percent;
    document.querySelector('.save-btn').textContent = 'Cập nhật voucher';
};

// Hàm được gọi khi nhấn Xóa (dựa vào mã voucher làm ID)
window.deleteVoucher = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã voucher " + code + "?")) return;
    try {
        // Giả định mã voucher được dùng làm ID Document
        await deleteDoc(doc(db, "vouchers", code)); 
        alert("Xóa voucher thành công!");
        loadVouchers(); 
    } catch (e) {
        console.error("Lỗi xóa voucher: ", e);
        alert("Xóa thất bại!");
    }
};

// --- 2. Xử lý Form Thêm/Sửa voucher ---
if (voucherForm) {
    voucherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldCode = document.getElementById('v_old_code').value;
        const newCode = document.getElementById('v_code').value.toUpperCase();
        const percent = parseInt(document.getElementById('v_percent').value);

        if (isNaN(percent) || percent <= 0 || percent > 100) {
            alert("Phần trăm giảm giá không hợp lệ.");
            return;
        }

        try {
            if (oldCode) {
                // Sửa (Update): Nếu mã code thay đổi, ta cần Xóa mã cũ và Thêm mã mới
                if (oldCode !== newCode) {
                    await deleteDoc(doc(db, "vouchers", oldCode));
                    await addDoc(collection(db, "vouchers"), { code: newCode, percent, createdAt: new Date() });
                } else {
                    // Cập nhật giá trị
                    await updateDoc(doc(db, "vouchers", newCode), { percent });
                }
                alert("Cập nhật voucher thành công!");
            } else {
                // Thêm mới (Add)
                // *Lưu ý: Nếu dùng newCode làm Document ID, bạn cần dùng setDoc thay vì addDoc.
                await addDoc(collection(db, "vouchers"), { code: newCode, percent, createdAt: new Date() });
                alert("Thêm voucher thành công!");
            }
            
            // Reset form và tải lại
            voucherForm.reset();
            document.getElementById('v_old_code').value = '';
            document.querySelector('.save-btn').textContent = 'Lưu voucher';
            loadVouchers(); 
        } catch (e) {
            console.error("Lỗi thao tác voucher: ", e);
            alert("Thao tác thất bại. Có thể mã đã tồn tại.");
        }
    });
}

loadVouchers();