import { db } from "@/firebaseConfig";
import { addDoc, collection, getDocs} from "firebase/firestore";

const COLLECTION_NAME = 'prescriptions';

const useCrud = () => {

    const fetchData = () => {

    }

    const addPrescription = async (prescriptionData: any) => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), prescriptionData);
            console.log('Document written with ID: ', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding document: ', error);
            throw error;
        }
    };

    const addPillToPrescription = async (prescriptionId: string, pillData: any) => {
        try {
            //lay reference toi collection prescriptions/{id}/pill, nghia la them data vao collection pill co ma id la prescri
            const pillCollectionRef = collection(db, COLLECTION_NAME, prescriptionId, "pills");
            const pillDocRef = await addDoc(pillCollectionRef, pillData);
            console.log('Pill added with ID:', pillDocRef.id);
            return pillDocRef.id;
        } catch (error) {
            console.error('Error adding pill:', error);
            throw error;
        }
    };
    
    const getPillsByPrescriptionId = async (prescriptionId: string) => {
        try {
            const pillsRef = collection(db, 'prescriptions', prescriptionId, 'pills');
            const snapshot = await getDocs(pillsRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching pills: ', error);
            throw error;
        }
    };

    const updatePrescription = () => {

    }

    const deletePrescription = () => {

    }

    return {
        fetchData,
        addPrescription,
        updatePrescription,
        deletePrescription,
        addPillToPrescription,
        getPillsByPrescriptionId,
    };
};

export default useCrud;