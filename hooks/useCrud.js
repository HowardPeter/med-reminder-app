import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useCallback } from "react";

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
  const fetchPrescriptionDataForSearch = useCallback(
    async (userId, keyWord, number) => {
      try {
        const prescriptionsRef = collection(db, COLLECTION_NAME);
        const q = query(prescriptionsRef, where("userId", "==", userId)); // chỉ lọc userId

        const snapshot = await getDocs(q);

        const prescriptions = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((item) => {
            if (keyWord != "") {
              const lowerKeyword = keyWord.toLowerCase();
              const nameMatch = item.name?.toLowerCase().includes(lowerKeyword);
              return nameMatch;
            }

            if (number === 1 || number === 0 || number === 7) {
              const numberMatch = number.toString().toLowerCase();
              const frequencyMatch = item.frequency
                ?.toString()
                .toLowerCase()
                .includes(numberMatch);
              return frequencyMatch;
            }
          });

        return prescriptions;
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        return [];
      }
    },
    []
  );

  const fetchPrescriptionById = useCallback(async (prescriptionId) => {
    try {
      const prescriptionRef = doc(db, COLLECTION_NAME, prescriptionId);
      const docSnap = await getDoc(prescriptionRef);
  
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        console.warn("No such prescription found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching prescription:", error);
      return null;
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

  const addPrescription = async (prescriptionData: any) => {
    try {
      const docRef = await addDoc(
        collection(db, COLLECTION_NAME),
        prescriptionData
      );
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  };

  const addPillToPrescription = async (
    prescriptionId: string,
    pillData: any
  ) => {
    try {
      //lay reference toi collection prescriptions/{id}/pill, nghia la them data vao collection pill co ma id la prescri
      const pillCollectionRef = collection(
        db,
        COLLECTION_NAME,
        prescriptionId,
        "pills"
      );
      const pillDocRef = await addDoc(pillCollectionRef, pillData);
      console.log("Pill added with ID:", pillDocRef.id);
      return pillDocRef.id;
    } catch (error) {
      console.error("Error adding pill:", error);
      throw error;
    }
  };

  const getPillsByPrescriptionId = async (prescriptionId: string) => {
    try {
      const pillsRef = collection(db, "prescriptions", prescriptionId, "pills");
      const snapshot = await getDocs(pillsRef);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Phat Error fetching pills: ", error);
      throw error;
    }
  };

  const updatePrescription = () => {};

  const deletePrescription = async (prescriptionId) => {
    const prescriptionRef = doc(db, "prescriptions", prescriptionId);

    try {
      // thu muc con
      const subCollectionNames = ["pill"];
      // thu muc con cua thu muc con
      for (const subCollection of subCollectionNames) {
        const subCollectionRef = collection(
          db,
          "prescriptions",
          prescriptionId,
          subCollection
        );
        const subDocsSnap = await getDocs(subCollectionRef);

        const deleteSubDocs = subDocsSnap.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deleteSubDocs);
      }

      await deleteDoc(prescriptionRef);

      console.log(
        `Đã xóa đơn thuốc ${prescriptionId} và các collection con của nó`
      );
    } catch (error) {
      console.error("Lỗi khi xóa đơn thuốc:", error);
    }
  };

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
      console.error("Nam Error fetching pills:", error);
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
    fetchPrescriptionById,
    addPrescription,
    addPillToPrescription,
    getPillsByPrescriptionId,
    updatePrescription,
    deletePrescription,
    getPrescriptionPills,
    deletePillById,
    fetchPrescriptionDataForSearch,
  };
};
