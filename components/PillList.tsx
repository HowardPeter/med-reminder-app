import React from "react";
import { FlatList, View } from "react-native";
import PillCard from "./PillCard";
import { images } from "@/constants";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

// Dummy data
const pills = [
  {
    id: "1",
    name: "Penicilin",
    type: "Pill",
    dosage: "1",
    icon: images.pill,
  },
  {
    id: "2",
    name: "Asthma Inhaler",
    type: "Inhaler",
    dosage: "1",
    icon: images.pill,
  },
  {
    id: "3",
    name: "Penicilin",
    type: "Pill",
    dosage: "1",
    icon: images.pill,
  },
  {
    id: "4",
    name: "Penicilin",
    type: "Pill",
    dosage: "1",
    icon: images.pill,
  },
  {
    id: "5",
    name: "Penicilin",
    type: "Pill",
    dosage: "1",
    icon: images.pill,
  },
  {
    id: "6",
    name: "Penicilin",
    type: "Pill",
    dosage: "1",
    icon: images.pill,
  },
  {
    id: "7",
    name: "Penicilin",
    type: "Pill",
    dosage: "1",
    icon: images.pill,
  },
  {
    id: "8",
    name: "Penicilin",
    type: "Pill",
    dosage: "1",
    icon: images.pill,
  },
];

const PillList = () => {
  return (
    <View style={{maxHeight: hp(50)}} className="rounded-xl bg-white overflow-hidden mx-4 mt-2">
      <FlatList 
        data={pills}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => (
          <PillCard
            name={item.name}
            type={item.type}
            dosage={item.dosage}
            icon={item.icon}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-2" />} // Separator between items
      />
    </View>
  );
};

export default PillList;
