import React from "react";
import { FlatList, View } from "react-native";
import PrescriptionCard from "./PrescriptionCard";

const prescriptions = [
    {
        id: "1",
        time: "7:30",
        title: "Prescription for stomachache",
        note: "After breakfast",
    },
    {
        id: "2",
        time: "12:00",
        title: "Vitamin D Supplement",
        note: "Before lunch",
    },
    {
        id: "3",
        time: "20:00",
        title: "Painkiller",
        note: "After dinner, wait for 30 mins",
    },
    {
        id: "4",
        time: "22:00",
        title: "Vitamin D Supplement",
        note: "Before bed",
    },
];

interface Prescription {
    id: string;
    time: string;
    title: string;
    note: string;
}

interface PrescriptionListProps {
    onToggle: () => void;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({ onToggle }) => {
    return (
        <View className="flex-1">
            <FlatList
                data={prescriptions}
                keyExtractor={(item: Prescription) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 16, paddingBottom: 70 }}
                renderItem={({ item }: { item: Prescription }) => (
                    <PrescriptionCard
                        time={item.time}
                        title={item.title}
                        note={item.note}
                        onToggle={onToggle}
                    />
                )}
            />
        </View>
    );
};

export default PrescriptionList;