// Sửa lỗi: Import các hàm Firestore từ firebase-firestore.js
import { addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; 
// Sửa lỗi: Import db từ file cấu hình đã được sửa (giả sử dùng id.js)
import { db } from "../js/id.js"; 

async function addAndFetchUsers() {
    try {
      // Ví dụ Thêm dữ liệu (Add)
      const docRef = await addDoc(collection(db, "users"), {
        first: "Alan",
        middle: "Mathison",
        last: "Turing",
        born: 1912
      });
    
      console.log("Document written with ID: ", docRef.id);
    
      // Ví dụ Lấy dữ liệu (Fetch)
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        // Log dữ liệu một cách hợp lý
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      });

    } catch (e) {
      console.error("Error adding/fetching document: ", e);
    }
}

// Lưu ý: Bạn cần gọi hàm này (addAndFetchUsers()) để nó chạy.
// addAndFetchUsers();