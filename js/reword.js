import { doc, updateDoc } from "firebase/firestore";
import { db } from "./id.js"; // Import db từ file khởi tạo

async function updateField() {
    try {
        const washingtonRef = doc(db, "cities", "DC");
    
        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
          capital: true
        });
        console.log("Field 'capital' updated in cities/DC.");
    } catch (e) {
        console.error("Error updating field: ", e);
    }
}