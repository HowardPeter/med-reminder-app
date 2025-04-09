import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import PillCard from "./PillCard";
import { images } from "@/constants";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

const ItemSeparator = () => <View className="h-2" />;

interface Pill {
  id: string;
  name: string;
  type: string;
  dosage: string;
  icon: keyof typeof images;
}

interface PillListProps {
  pills: Pill[];
}

const PillList = ({ pills }: PillListProps) => {
  const getPillIcon = (type: string) => {
    switch (type) {
      case "pill":
        return images.pill;
      case "inhaler":
        return images.inhaler;
      case "injection":
        return images.injection;
      default:
        return images.pill;
    }
  };

  return (
    <View style={{maxHeight: hp(50)}} className="rounded-xl bg-white overflow-hidden mx-4 mt-2">
      <FlatList
        data={pills}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => (
          <PillCard
            name={item?.name}
            type={item?.type}
            dosage={item?.dosage}
            icon={getPillIcon(item?.type)}
          />
        )}
        ItemSeparatorComponent={ItemSeparator} // Separator between items
      />
    </View>
  );
};

export default PillList;
