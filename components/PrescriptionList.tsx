import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import PrescriptionCard from "./PrescriptionCard";
import { useAuth } from "@/hooks/useAuth";
import { useCrud } from "@/hooks/useCrud";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import moment from "moment";

interface PrescriptionProps {
    id: string;
    time: string;
    name: string;
    note: string;
    fullPrescription: any;
}

interface PrescriptionListProps {
    selectedDate: Date;
    onSelectPrescription: (prescription: any, time: string) => void;
}

type PrescriptionCallback = (data: PrescriptionProps[]) => void;

// Hàm subscribeToPrescriptionData lắng nghe sự thay đổi dữ liệu trong Firestore
// và gọi callback với dữ liệu mới khi có sự thay đổi
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

const PrescriptionList: React.FC<PrescriptionListProps> = ({ selectedDate, onSelectPrescription }) => {
    const { user } = useAuth();
    const { fetchPrescriptionData } = useCrud();
    const [refreshing, setRefreshing] = useState(false);
    const [prescriptions, setPrescriptions] = useState<PrescriptionProps[]>([]);

    const userId = user?.userId ?? null;    

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

    // Hàm filter đơn thuốc theo ngày bắt đầu và clone theo frequency
    const filteredPrescriptions = useMemo(() => {
        const today = moment().startOf('day');
        const selected = moment(selectedDate).startOf('day');
        const twoWeeksLater = today.clone().add(20, 'days'); // Giới hạn trong 14 ngày
                
        return prescriptions.filter(item => {
            const { startDate, frequency } = item.fullPrescription ?? {};
            if (!startDate || !startDate.seconds) return false;

            const start = moment(new Date(startDate.seconds * 1000)).startOf('day');

            // Nếu ngoài 2 tuần thì bỏ qua
            if (selected.isAfter(twoWeeksLater)) return false;

            // Nếu không lặp
            if (Number(frequency) === 0) {
                return selected.isSame(start);
            }

            // Nếu có lặp, kiểm tra selected có nằm đúng chu kỳ lặp
            const diff = selected.diff(start, 'days');
            return diff >= 0 && diff % Number(frequency) === 0;
        });
    }, [prescriptions, selectedDate]);

    return (
        <View className="flex-1">
            <FlatList
                data={filteredPrescriptions}
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
                            onSelectPrescription(item.fullPrescription ?? item, item.time);
                        }}
                    />
                )}
            />
        </View>
    );
};

export default PrescriptionList;
