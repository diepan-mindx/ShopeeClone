// voucher.js (Logic Quản lý Voucher)
import { db } from "./firebase_config.js";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"; 

const voucherForm = document.getElementById('voucherForm');
const voucherTableBody = document.getElementById('voucherTableBody');

// ... [Toàn bộ logic CRUD voucher đã cung cấp ở câu trả lời trước] ...

async function loadVouchers() {
    // ... logic loadVouchers (đã có trong câu trả lời trước)
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

window.editVoucher = (code, percent) => { /* ... */ };
window.deleteVoucher = async (code) => { /* ... */ };

if (voucherForm) {
    voucherForm.addEventListener('submit', async (e) => {
        // ... logic form submit Thêm/Sửa (đã có trong câu trả lời trước)
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
                // Sửa/Cập nhật
                if (oldCode !== newCode) {
                    await deleteDoc(doc(db, "vouchers", oldCode));
                    await addDoc(collection(db, "vouchers"), { code: newCode, percent, createdAt: new Date() });
                } else {
                    await updateDoc(doc(db, "vouchers", newCode), { percent });
                }
                alert("Cập nhật voucher thành công!");
            } else {
                // Thêm mới
                await addDoc(collection(db, "vouchers"), { code: newCode, percent, createdAt: new Date() });
                alert("Thêm voucher thành công!");
            }
            
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