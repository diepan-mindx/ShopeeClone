import { doc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "./id.js"; // Import db từ file khởi tạo

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