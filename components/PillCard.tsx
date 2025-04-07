import React from "react";
import { View, Text, Image } from "react-native";

interface PillCardProps {
  name: string;
  type: string;
  dosage: string;
  icon: any; // Replace 'any' with a more specific type if possible, e.g., ImageSourcePropType
}

const PillCard: React.FC<PillCardProps> = ({ name, type, dosage, icon }) => {
  return (
    <View className="flex-row justify-between items-center border-b border-gray-200 px-4 py-3 bg-white">
      <View className="flex-row items-center space-x-3">
        <Image source={icon} className="w-6 h-6" resizeMode="contain" />
        <View className="ml-3">
          <Text className="font-bold text-base">{name}</Text>
          <Text className="text-gray-500 text-sm">{type}</Text>
        </View>
      </View>
      <Text className="text-gray-700 font-medium">Dosage: {dosage}</Text>
    </View>
  );
};

export default PillCard;
