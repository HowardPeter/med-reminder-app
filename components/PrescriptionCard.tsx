import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Entypo, FontAwesome } from "@expo/vector-icons";
import theme from "@/config/theme";
import { useTaken } from "@/hooks/useTaken";
import moment from "moment";

interface PrescriptionCardProps {
  time: string;
  title: string;
  note: string;
  onToggle?: () => void;
  prescriptionId: string;
  userId: string;
  date: Date;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ time, title, note, onToggle, prescriptionId, userId, date }) => {
  const [isTaken, setIsTaken] = useState(false);
  const { markPrescriptionTaken, unmarkPrescriptionTaken, checkPrescriptionTaken } = useTaken()
  const today = moment().format("YYYY-MM-DD");
  const selectedDate = moment(date).format("YYYY-MM-DD");

  useEffect(() => {
    const checkTaken = async () => {
      const taken = await checkPrescriptionTaken(userId, prescriptionId, date, time);
      setIsTaken(taken ?? false);
    };
    checkTaken();
  }, [userId, prescriptionId, date, time]);

  const handleTake = async () => {
    if (isTaken) return;
    if (selectedDate < today) {
      Alert.alert("There are some mistakes", "Hmm, this prescription is in the past, maybe you skipped it!");
      return;
    } else if (selectedDate > today) {
      Alert.alert("There are some mistakes", "You cannot take the prescription in the future!");
      return;
    }
    await markPrescriptionTaken(userId, prescriptionId, date, time);
    setIsTaken(true);
  };

  const handleUnTake = async () => {
    if (!isTaken) return;
    await unmarkPrescriptionTaken(userId, prescriptionId, date, time);
    setIsTaken(false);
  };

  return (
    <View className="bg-white rounded-xl shadow-3xl overflow-hidden mb-4 mx-4">
      <TouchableOpacity onPress={onToggle}>
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center mr-2">
              <FontAwesome name="clock-o" size={20} color="#000" />
              <Text style={{ fontSize: hp(2) }} className="ml-2 font-bold">{time}</Text>
            </View>
            <View className={`${isTaken ? 'visible' : 'invisible'}`}>
              <View className="flex-row items-center mr-2">
                <Entypo name="check" size={25} color="green" />
                <Text style={{ fontSize: hp(2.1) }} className="text-green-700 font-bold">Taken</Text>
              </View>
            </View>
          </View>
          <Text style={{ fontSize: hp(2.2) }} className="font-bold mb-1">{title}</Text>
          <Text className="text-gray-500">{note}</Text>
        </View>
      </TouchableOpacity>

      <View className="flex-row border-t border-gray-200">
        <TouchableOpacity
          onPress={handleTake}
          style={{ backgroundColor: theme.colors.primary }}
          className="flex-1 p-3 items-center justify-center rounded-bl-xl">
          <Text style={{ fontSize: hp(2) }} className="text-white font-bold">Take</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUnTake}
          className="flex-1 bg-gray-300 p-3 items-center justify-center rounded-br-xl">
          <Text style={{ fontSize: hp(2) }} className="text-gray-500 font-bold">Un-take</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrescriptionCard;
