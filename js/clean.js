// Sửa lỗi: Import các hàm Firestore từ firebase-firestore.js
import { doc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
// Sửa lỗi: Import db từ file cấu hình đã được sửa (giả sử dùng id.js)
import { db } from "../js/id.js";

async function removeField() {
    try {
        const cityRef = doc(db, 'cities', 'BJ');
    
        // Remove the 'capital' field from the document
        await updateDoc(cityRef, {
            capital: deleteField()
        });
        console.log("Field 'capital' removed from cities/BJ.");
    } catch (e) {
        console.error("Error removing field: ", e);
    }
}

// Lưu ý: Bạn cần gọi hàm này (removeField()) để nó chạy.
// removeField();