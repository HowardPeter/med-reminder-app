import { db } from "@/firebaseConfig";
import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from "firebase/firestore";

export const useTaken = () => {
    // Hàm đánh dấu đơn thuốc đã uống và thêm vào database
    const markPrescriptionTaken = async (userId, prescriptionId, date, time) => {
        try {
            if(!userId || !prescriptionId || !date || !time) {
                return;
            }
            const takenRef = collection(db, "takenPrescriptions");
            await addDoc(takenRef, { userId, prescriptionId, date, time });
        } catch (error) {
            console.error("Error marking prescription as taken:", error);
        }
    };
    
    // Hàm bỏ đánh dấu đơn thuốc đã uống và xóa khỏi database
    const unmarkPrescriptionTaken = async (userId, prescriptionId, date, time) => {
        try {
            if(!userId || !prescriptionId || !date || !time) {
                return;
            }
            const takenRef = collection(db, "takenPrescriptions");
            const q = query(takenRef,
                where("userId", "==", userId),
                where("prescriptionId", "==", prescriptionId),
                where("date", "==", date),
                where("time", "==", time)
            );
    
            const snapshot = await getDocs(q);
            snapshot.forEach(docSnap => {
                deleteDoc(doc(db, "takenPrescriptions", docSnap.id));
            });
        } catch (error) {
            console.error("Error unmarking prescription as taken:", error);
        }
    };
    
    // Hàm kiểm tra đơn thuốc đã uống hay chưa
    const checkPrescriptionTaken = async (userId, prescriptionId, date, time) => {
        try {
            if(!userId || !prescriptionId || !date || !time) {
                return false;
            }
            const takenRef = collection(db, "takenPrescriptions");
            const q = query(takenRef,
                where("userId", "==", userId),
                where("prescriptionId", "==", prescriptionId),
                where("date", "==", date),
                where("time", "==", time)
            );
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        } catch (error) {
            console.error("Error checking prescription taken:", error);
        }
    };

    return {
        markPrescriptionTaken,
        unmarkPrescriptionTaken,
        checkPrescriptionTaken,
    };
}
