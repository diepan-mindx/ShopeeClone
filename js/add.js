// Thay thế đường dẫn import sai bằng module chuẩn và import db từ id.js
import { addDoc, collection, getDocs } from "firebase/firestore"; 
import { db } from "./id.js"; // Import db từ file khởi tạo

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
        console.log(`${doc.id} => ${doc.data()}`);
      });

    } catch (e) {
      console.error("Error adding/fetching document: ", e);
    }
}

// Lưu ý: Bạn cần gọi hàm này (addAndFetchUsers()) để nó chạy.