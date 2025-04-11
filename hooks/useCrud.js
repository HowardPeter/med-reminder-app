import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useCallback, useEffect, useMemo } from "react";

const COLLECTION_NAME = 'prescriptions';

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
            const pillsRef = collection(db, COLLECTION_NAME, prescriptionId, 'pills');
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

    const addPrescription = () => {

    }

    const updatePrescription = () => {

    }

    const deletePrescription = () => {

    }

    return {
        fetchPrescriptionData,
        fetchPillsData,
        addPrescription,
        updatePrescription,
        deletePrescription,
    };
};