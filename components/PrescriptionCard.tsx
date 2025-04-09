// components/PrescriptionCard.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FontAwesome } from "@expo/vector-icons";
import theme from "@/config/theme";

interface PrescriptionCardProps {
  time: string;
  title: string;
  note: string;
  onToggle?: () => void;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ time, title, note, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} className="bg-white rounded-xl shadow-3xl overflow-hidden mb-4 mx-4">
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <FontAwesome name="clock-o" size={20} color="#000" />
          <Text style={{ fontSize: hp(2) }} className="ml-2 font-bold">{time}</Text>
        </View>
        <Text style={{ fontSize: hp(2.2) }} className="font-bold mb-1">{title}</Text>
        <Text className="text-gray-500">{note}</Text>
      </View>

      <View className="flex-row border-t border-gray-200">
        <TouchableOpacity style={{backgroundColor: theme.colors.primary}} className="flex-1 p-3 items-center justify-center rounded-bl-xl">
          <Text style={{ fontSize: hp(2) }} className="text-white font-bold">Take</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-gray-300 p-3 items-center justify-center rounded-br-xl">
          <Text style={{ fontSize: hp(2) }} className="text-gray-500 font-bold">Skip</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PrescriptionCard;
