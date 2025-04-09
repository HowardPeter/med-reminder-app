import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import PrescriptionCard from "./PrescriptionCard";
import { useAuth } from "@/hooks/useAuth";
import { useCrud } from "@/hooks/useCrud";
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface Prescription {
    id: string;
    time: string[];
    name: string;
    note: string;
}

interface PrescriptionListProps {
    onToggle: () => void;
}

interface PrescriptionData {
    id: string;
    time: string[];
    name: string;
    note: string;
}

type PrescriptionCallback = (data: PrescriptionData[]) => void;

const subscribeToPrescriptionData = (userId: string, callback: PrescriptionCallback): () => void => {
    const prescriptionsRef = collection(db, 'prescriptions');
    const q = query(prescriptionsRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const prescriptions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as PrescriptionData));
        callback(prescriptions);
    });

    return unsubscribe;
};

const PrescriptionList: React.FC<PrescriptionListProps> = ({ onToggle }) => {
    const { user } = useAuth();
    const { fetchPrescriptionData } = useCrud();
    const [refreshing, setRefreshing] = useState(false);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

    const userId = user?.userId || null;

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = subscribeToPrescriptionData(userId, (data) => {
            setPrescriptions(data);
        });

        return () => {
            unsubscribe(); // cleanup listener khi component unmount
        };
    }, [userId, subscribeToPrescriptionData]);

    const onRefresh = async () => {
        if (!userId) return;
        setRefreshing(true);
        const data = await fetchPrescriptionData(userId);
        setPrescriptions(data);
        setRefreshing(false);
    };

    return (
        <View className="flex-1">
            <FlatList
                data={prescriptions}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{ paddingVertical: 16, paddingBottom: 70 }}
                renderItem={({ item }) => (
                    <PrescriptionCard
                        time={item.time.join(", ")}
                        title={item.name}
                        note={item.note}
                        onToggle={onToggle}
                    />
                )}
            />
        </View>
    );
};

export default PrescriptionList;
