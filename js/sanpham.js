// sanpham.js (Logic Thêm/Sửa/Xóa Sản phẩm)
import { db } from "./firebase_config.js";
import { 
    collection, addDoc, getDocs, doc, deleteDoc, updateDoc,
    query, orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; 

const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody'); 

// ... [Toàn bộ logic CRUD sản phẩm đã cung cấp ở câu trả lời trước] ...

async function loadProducts() {
    // ... logic loadProducts (đã có trong câu trả lời trước)
    productTableBody.innerHTML = '<tr><td colspan="5">Đang tải sản phẩm...</td></tr>';
    try {
        const productsCol = collection(db, "products");
        const q = query(productsCol, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        
        productTableBody.innerHTML = '';
        if (snapshot.empty) {
            productTableBody.innerHTML = '<tr><td colspan="5">Chưa có sản phẩm nào.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const row = productTableBody.insertRow();
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${new Intl.NumberFormat('vi-VN').format(data.price || 0)} VND</td>
                <td>${data.description || ''}</td>
                <td>
                    <button class="btn btn-secondary" onclick="editProduct('${doc.id}', '${data.name}', ${data.price || 0}, '${data.description || ''}')">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${doc.id}')">Xóa</button>
                </td>
            `;
        });
    } catch (e) {
        console.error("Lỗi tải sản phẩm: ", e);
        productTableBody.innerHTML = '<tr><td colspan="5">Lỗi tải dữ liệu.</td></tr>';
    }
}

window.editProduct = (id, name, price, desc) => { /* ... */ };
window.deleteProduct = async (id) => { /* ... */ };

if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        // ... logic form submit Thêm/Sửa (đã có trong câu trả lời trước)
        e.preventDefault();
        const productId = document.getElementById('p_id').value;
        const name = document.getElementById('p_name').value;
        const price = parseFloat(document.getElementById('p_price').value);
        const desc = document.getElementById('p_desc').value;

        if (isNaN(price) || price < 0) {
            alert("Giá không hợp lệ.");
            return;
        }

        try {
            if (productId) {
                await updateDoc(doc(db, "products", productId), { name, price, description: desc });
                alert("Cập nhật sản phẩm thành công!");
            } else {
                await addDoc(collection(db, "products"), { name, price, description: desc, createdAt: new Date() });
                alert("Thêm sản phẩm thành công!");
            }
            
            productForm.reset();
            document.getElementById('p_id').value = '';
            document.querySelector('.btn-primary').textContent = 'Lưu sản phẩm';
            loadProducts(); 
        } catch (e) {
            console.error("Lỗi thao tác sản phẩm: ", e);
            alert("Thao tác thất bại.");
        }
    });
}

loadProducts();