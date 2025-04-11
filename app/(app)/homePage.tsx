import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import theme from "@/config/theme";
import CalendarSlider from "@/components/CalendarSlider";
import { SafeAreaView } from "react-native-safe-area-context";
import PrescriptionList from "@/components/PrescriptionList";
import ReactNativeModal from "react-native-modal";
import PillList from "@/components/PillList";
import CustomAlert from "@/components/CustomAlert";
import { router } from "expo-router";
import { useCrud } from "@/hooks/useCrud";

const HomePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState({
    id: "",
    name: "",
    time: "",
    note: "",
  });
  const [pills, setPills] = useState<{ id: string, name: string, type: string, dosage: string }[]>([]);
  const { fetchPillsData } = useCrud();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedPrescriptionId = selectedPrescription?.id ?? null;

  const moveToAddPresctiption = () => {
    setIsModalVisible(false);
    setIsAlertVisible(false);
    router.push('/addPrescription');
  }

  const moveToUpdatePrescription = () => {
    setIsModalVisible(false);
    setIsAlertVisible(false);
    router.push({
      pathname: '/(app)/updatePrescription',
      params: { prescriptionId: selectedPrescriptionId },
    });
  }

  const handleDeletePrescription = () => {
    setIsAlertVisible(false);
  }

  useEffect(() => {
    fetchPills();
  }, [selectedPrescriptionId]);

  const fetchPills = async () => {
    if (!selectedPrescriptionId) {
      console.log("No prescription ID selected.");
      return;
    }
    const data = await fetchPillsData(selectedPrescriptionId);
    setPills(data);
    console.log("Selected prescription:", selectedPrescription);
    console.log("Fetched pills data:", data);
    setIsModalVisible(true);
  };

  return (
    <View style={{ backgroundColor: theme.colors.background }} className="flex-1">
      {/* Header Section */}
      <SafeAreaView style={{ backgroundColor: theme.colors.primary }} className="rounded-b-3xl p-5">
        <CalendarSlider selectedDate={selectedDate} onSelectDate={setSelectedDate}/>
      </SafeAreaView>

      {/* Body */}
      <PrescriptionList
        onSelectPrescription={(prescription, time) =>
          setSelectedPrescription({
            id: prescription.id,
            name: prescription.name,
            note: prescription.note,
            time: time,
          })
        }
        selectedDate={selectedDate}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={moveToAddPresctiption}
        style={{ width: hp(7), height: hp(7) }}
        className="absolute bottom-20 right-5 bg-white rounded-full items-center justify-center shadow-strong">
        <Text style={{ fontSize: hp(4) }} className="text-orange-500">+</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={{ backgroundColor: theme.colors.primary }} className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center h-16 rounded-t-3xl">
        <TouchableOpacity>
          <FontAwesome name="home" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name="pill" size={35} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/userSettings')}>
          <FontAwesome name="user" size={35} color="gray" />
        </TouchableOpacity>
      </View>

      <ReactNativeModal
        isVisible={isModalVisible}
        animationIn={'fadeIn'}>
        <View className="bg-teal-50 rounded-xl pb-6">
          {/* Top control icons */}
          <View style={{ backgroundColor: theme.colors.primary }} className="flex-row justify-between items-center py-4 px-5 mb-4 rounded-t-xl">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={moveToUpdatePrescription}>
                <FontAwesome name="pencil" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsAlertVisible(true)} className="ml-5">
                <FontAwesome name="trash" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => {
              setIsModalVisible(false);
              setSelectedPrescription({
                id: "",
                name: "",
                time: "",
                note: "",
              });
            }}>
              <FontAwesome name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View className="px-4">
            <Text style={{ fontSize: hp(2.3) }} className="font-bold text-center mb-3">
              {selectedPrescription?.name}
            </Text>
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="event" size={20} color="black" />
              <Text style={{ fontSize: hp(1.9) }} className="ml-2">Scheduled for {selectedPrescription?.time} today</Text>
            </View>
            <View className="flex-row items-center mb-2 mt-1">
              <MaterialIcons name="chat-bubble-outline" size={20} color="black" />
              <Text style={{ fontSize: hp(1.9) }} className="ml-2">{selectedPrescription?.note}</Text>
            </View>
          </View>

          {/* Pills */}
          <PillList pills={pills} />
        </View>
      </ReactNativeModal>

      <ReactNativeModal
        isVisible={isAlertVisible}>
        <CustomAlert
          title="Prescription for headache"
          message="Do you want to delete this prescription? All future notifications will be deleted."
          btnConfirm="Delete"
          confirmTextColor="text-red-500"
          onCancel={() => setIsAlertVisible(false)}
          onConfirm={handleDeletePrescription} />
      </ReactNativeModal>
    </View>
  );
};

export default HomePage;