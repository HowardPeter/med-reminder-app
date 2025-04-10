import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import PrescriptionCard from "./PrescriptionCard";
import { useAuth } from "@/hooks/useAuth";
import { useCrud } from "@/hooks/useCrud";
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface PrescriptionProps {
    id: string;
    time: string;
    name: string;
    note: string;
}

interface PrescriptionListProps {
    onSelectPrescription: (prescription: any, time: string) => void;
}

type PrescriptionCallback = (data: PrescriptionProps[]) => void;

const subscribeToPrescriptionData = (userId: string, callback: PrescriptionCallback): () => void => {
    const prescriptionsRef = collection(db, 'prescriptions');
    const q = query(prescriptionsRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const prescriptions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as PrescriptionProps));
        callback(prescriptions);
    });

    return unsubscribe;
};

// Hàm chia presctiption thành nhiều phần dựa trên thời gian và sắp xếp theo thứ tự thời gian
const expandAndSortPrescriptions = (data: PrescriptionProps[]) => {
    // Chia prescription thành nhiều phần dựa trên thời gian
    const expanded = data.flatMap((item) =>
        item.time.map((t) => ({
            id: `${item?.id}-${t}`,
            name: item?.name,
            note: item?.note,
            time: t,
            originalId: item?.id,
            fullPrescription: item,
        }))
    );

    // Sắp xếp theo thứ tự thời gian
    const sorted = expanded.sort((a, b) => {
        const [aHour, aMin] = a.time.split(":").map(Number);
        const [bHour, bMin] = b.time.split(":").map(Number);
        return aHour !== bHour ? aHour - bHour : aMin - bMin;
    });

    return sorted;
};

const PrescriptionList: React.FC<PrescriptionListProps> = ({ onSelectPrescription }) => {
    const { user } = useAuth();
    const { fetchPrescriptionData } = useCrud();
    const [refreshing, setRefreshing] = useState(false);
    const [prescriptions, setPrescriptions] = useState<PrescriptionProps[]>([]);

    const userId = user?.userId || null;

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = subscribeToPrescriptionData(userId, (data) => {
            const processed = expandAndSortPrescriptions(data);
            setPrescriptions(processed);
        });

        return () => {
            unsubscribe(); // cleanup listener khi component unmount
        };
    }, [userId, subscribeToPrescriptionData]);

    const onRefresh = async () => {
        if (!userId) return;

        setRefreshing(true);

        try {
            const data = await fetchPrescriptionData(userId);
            const processed = expandAndSortPrescriptions(data);
            setPrescriptions(processed);
        } catch (error) {
            console.error("Refresh error:", error);
        } finally {
            setRefreshing(false);
        }
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
                        time={item.time}
                        title={item.name}
                        note={item.note}
                        onToggle={() => {
                            onSelectPrescription(item.fullPrescription || item, item.time);
                            console.log("Selected prescription time:", item.time);
                        }}
                    />
                )}
            />
        </View>
    );
};

export default PrescriptionList;
