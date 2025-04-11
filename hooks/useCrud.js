import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useCallback, useEffect, useMemo } from "react";

const COLLECTION_NAME = "prescriptions";

export const useCrud = () => {
  const fetchPrescriptionData = useCallback(async (userId) => {
    try {
      const prescriptionsRef = collection(db, COLLECTION_NAME);
      const q = query(prescriptionsRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      const prescriptions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return prescriptions;
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      return [];
    }
  }, []);

  const fetchPillsData = useCallback(async (prescriptionId) => {
    try {
      const pillsRef = collection(db, COLLECTION_NAME, prescriptionId, "pills");
      const snapshot = await getDocs(pillsRef);

      const pills = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return pills;
    } catch (error) {
      console.error("Error fetching pills:", error);
      return [];
    }
  }, []);

  const addPrescription = () => {};

  const updatePrescription = () => {};

  const deletePrescription = () => {};

  async function getPrescriptionPills(prescriptionId) {
    try {
      // 1. Tham chiếu đến prescription document chính
      const prescriptionRef = doc(db, "prescriptions", prescriptionId);

      // 2. Kiểm tra document tồn tại
      const prescriptionSnap = await getDoc(prescriptionRef);

      if (!prescriptionSnap.exists()) {
        throw new Error("Prescription not found!");
      }

      // 3. Tham chiếu đến subcollection "pills"
      const pillsColRef = collection(prescriptionRef, "pills");

      // 4. Lấy tất cả documents trong subcollection
      const pillsSnapshot = await getDocs(pillsColRef);

      // 5. Chuyển đổi thành mảng dữ liệu
      const pillsData = pillsSnapshot.docs.map((doc) => ({
        id: doc.id, // Document ID
        ...doc.data(), // Tất cả fields trong document
      }));

      console.log("Pills data:", pillsData);
      return pillsData;
    } catch (error) {
      console.error("Error fetching pills:", error);
      throw error; // Hoặc xử lý lỗi theo cách khác
    }
  }
  async function deletePillById(
    prescriptionId: string,
    pillId: string
  ): Promise<void> {
    try {
      // 1. Tạo reference đến document cần xóa
      const pillDocRef = doc(
        db,
        "prescriptions",
        prescriptionId,
        "pills",
        pillId
      );

      // 2. Thực hiện xóa document
      await deleteDoc(pillDocRef);

      console.log(
        `Đã xóa thành công pill ${pillId} từ prescription ${prescriptionId}`
      );
    } catch (error) {
      console.error("Lỗi khi xóa pill:", error);
      throw new Error(`Không thể xóa pill ${pillId}`);
    }
  }

  return {
    fetchPrescriptionData,
    fetchPillsData,
    addPrescription,
    updatePrescription,
    deletePrescription,
    getPrescriptionPills,
    deletePillById,
  };
};
