// import { Alert } from "react-native";
// import { doc, deleteDoc } from "firebase/firestore";
// import { db } from "../../firebaseConfig"; 


// const deletePrescription = async (prescriptionId: string) => {
//   try {
//     await deleteDoc(doc(db, "prescriptions", prescriptionId));
//     Alert.alert("Success", "Prescription deleted successfully!");
//   } catch (error) {
//     console.error("Error deleting prescription: ", error);
//     Alert.alert("Error", "Failed to delete prescription.");
//   }
// };

// export default deletePrescription;

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Alert } from "react-native";


const deletePrescription = async (prescriptionId) => {
  const prescriptionRef = doc(db, "prescriptions", prescriptionId);

  try {
      // thu muc con
      const subCollectionNames = ["pill"]; 
      // thu muc con cua thu muc con
      for (const subCollection of subCollectionNames) {
          const subCollectionRef = collection(db, "prescriptions", prescriptionId, subCollection);
          const subDocsSnap = await getDocs(subCollectionRef);
          
          const deleteSubDocs = subDocsSnap.docs.map(doc => deleteDoc(doc.ref));
          await Promise.all(deleteSubDocs); 
      }

      
      await deleteDoc(prescriptionRef);

      console.log(`Đã xóa đơn thuốc ${prescriptionId} và các collection con của nó`);
      Alert.alert("Prescription deleted successfully!");
  } catch (error) {
      console.error("Lỗi khi xóa đơn thuốc:", error);
  }
};



export default deletePrescription;