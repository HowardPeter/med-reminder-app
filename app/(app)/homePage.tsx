import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import theme from "@/config/theme";
import CalendarSlider from "@/components/CalendarSlider";
import { SafeAreaView } from "react-native-safe-area-context";
import PrescriptionList from "@/components/PrescriptionList";
import ReactNativeModal from "react-native-modal";
import PillList from "@/components/PillList";
import CustomAlert from "@/components/CustomAlert";
import { router } from "expo-router";
import { useCrud } from "@/hooks/useCrud";
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from "@/hooks/useAuth";
import moment from "moment";

export default function HomePage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const hasScheduledRef = useRef(false);
  const [selectedPrescription, setSelectedPrescription] = useState({
    id: "",
    name: "",
    time: "",
    note: "",
  });
  // const [selectedPrescriptionFull, setSelectedPrescriptionFull] = useState({
  //   id: "",
  //   name: "",
  //   time: [],
  //   frequency: 0,
  //   startDate: null,
  //   note: "",
  // });
  const [pills, setPills] = useState<
    { id: string; name: string; type: string; dosage: string }[]
  >([]);

  const { fetchPillsData, deletePrescription, getPrescriptionPills, fetchPrescriptionById, fetchPrescriptionData } = useCrud();
  const { user } = useAuth();
  const { scheduleNotification } = useNotification();

  const userId = user?.userId ?? null;
  const selectedPrescriptionId = selectedPrescription?.id ?? null;

  const moveToAddPresctiption = () => {
    setIsModalVisible(false);
    setIsAlertVisible(false);
    router.push("/addPrescription");
  };

  const moveToUpdatePrescription = () => {
    setIsModalVisible(false);
    setIsAlertVisible(false);
    router.push({
      pathname: "/(app)/updatePrescription",
      params: { prescriptionId: selectedPrescriptionId },
    });
  };

  const handleDeletePrescription = async () => {
    if (!selectedPrescriptionId) {
      console.log("No prescription ID selected for deletion.");
      return;
    }
    await deletePrescription(selectedPrescriptionId);
    setIsAlertVisible(false);
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchPills();

    // const fetchSelectedPrescription = async () => {
    //   if (!selectedPrescriptionId) return;

    //   const prescription = await fetchPrescriptionById(selectedPrescriptionId);
    //   if (prescription) {
    //     setSelectedPrescriptionFull({
    //       id: prescription.id,
    //       name: prescription.name,
    //       time: prescription.time || [],
    //       frequency: prescription.frequency || 0,
    //       startDate: prescription.startDate || null,
    //       note: prescription.note || "",
    //     });
    //   }
    // };

    // fetchSelectedPrescription();
  }, [selectedPrescriptionId]);

  useEffect(() => {
    fetchPrescriptions();
  }, [userId]);

  // Lọc các đơn thuốc cần uống trong ngày hôm nay
  const filterTodayPrescriptions = (prescriptions: any) => {
    if (!prescriptions || prescriptions.length === 0) return [];
    const today = moment().startOf('day');

    return prescriptions.filter((prescription: any) => {
      const frequency = prescription?.frequency;
      const startDate = moment.unix(prescription.startDate?.seconds || 0).startOf('day');

      switch (frequency) {
        case 0:
          // Uống đúng ngày startDate
          return today.isSame(startDate, 'day');

        case 1:
          // Uống mỗi ngày
          return today.isSameOrAfter(startDate, 'day');

        case 7:
          // Uống mỗi tuần (7 ngày 1 lần)
          const diffWeeks = today.diff(startDate, 'weeks');
          return today.isoWeekday() === startDate.isoWeekday() && diffWeeks >= 0;

        default:
          return false;
      }
    });
  };

  const fetchPrescriptions = async () => {
    if (!userId || hasScheduledRef.current) return;
    const data = await fetchPrescriptionData(userId);
    const todayPrescriptions = filterTodayPrescriptions(data);
    scheduleNotification(todayPrescriptions);
    console.log("Today prescriptions:", todayPrescriptions);
    hasScheduledRef.current = true;
  }

  const fetchPills = async () => {
    if (!selectedPrescriptionId) {
      // console.log("No prescription ID selected.");
      return;
    }
    const data = await fetchPillsData(selectedPrescriptionId);
    setPills(data);
    console.log("Selected prescription:", selectedPrescription);
    console.log("Fetched pills data:", data);
    setIsModalVisible(true);
  };

  // const getFrequencyText = (frequency: number) => {
  //   switch (frequency) {
  //     case 0: return "No repeat";
  //     case 1: return "Every day";
  //     case 7: return "Every week";
  //     default: return `Every ${frequency} day(s)`;
  //   }
  // };

  // const formatDateFlexible = (dateValue: any) => {
  //   let dateObj: Date;

  //   if (!dateValue) return "Unknown start date";

  //   // Trường hợp Firestore Timestamp { seconds, nanoseconds }
  //   if (typeof dateValue === "object" && "seconds" in dateValue) {
  //     dateObj = new Date(dateValue.seconds * 1000);
  //   }
  //   // Trường hợp có phương thức toDate()
  //   else if (typeof dateValue?.toDate === "function") {
  //     dateObj = dateValue.toDate();
  //   }
  //   // Trường hợp là đối tượng Date
  //   else if (dateValue instanceof Date) {
  //     dateObj = dateValue;
  //   }
  //   // Trường hợp là chuỗi parse được
  //   else {
  //     const parsed = new Date(dateValue);
  //     if (!isNaN(parsed.getTime())) {
  //       dateObj = parsed;
  //     } else {
  //       return "Invalid date";
  //     }
  //   }

  //   return dateObj.toLocaleDateString("en-GB", {
  //     day: "2-digit",
  //     month: "long",
  //     year: "numeric",
  //   });
  // };

  //   const onShare = async () => {
  //     try {
  //       if (!selectedPrescriptionId) {
  //         Alert.alert("No prescription selected.");
  //         return;
  //       }

  //       const pillsData = await getPrescriptionPills(selectedPrescriptionId);

  //       const pillsText = pillsData.length
  //         ? pillsData.map((pill, index) =>
  //           `${index + 1}. ${pill.name} - ${pill.dosage} (${pill.type})`
  //         ).join("\n")
  //         : "No pills listed for this prescription.";

  //       const timeText = selectedPrescriptionFull.time.length
  //         ? selectedPrescriptionFull.time.join(", ")
  //         : "No time set.";

  //       const frequencyText = getFrequencyText(selectedPrescriptionFull.frequency);
  //       const startDateText = formatDateFlexible(selectedPrescriptionFull.startDate);

  //       const message = `📋 Prescription: ${selectedPrescriptionFull.name}
  //   🗓️ Started date: ${startDateText}
  //   🔁 Frequency: ${frequencyText}
  //   🕐 Time(s): ${timeText}
  //   📝 Note: ${selectedPrescriptionFull.note || "No note for this prescription!!"}
  // 💊 Pills list:
  // ${pillsText}
  // 📲 Check out PillPall - your pill reminder & medication manager!`;

  //       const result = await Share.share({ message });

  //       if (result.action === Share.sharedAction) {
  //         // optionally handle shared
  //       } else if (result.action === Share.dismissedAction) {
  //         // optionally handle dismissed
  //       }
  //     } catch (error: any) {
  //       Alert.alert(error.message);
  //     }

  return (
    <View
      style={{ backgroundColor: theme.colors.background }}
      className="flex-1"
    >
      {/* Header Section */}
      <SafeAreaView
        style={{ backgroundColor: theme.colors.primary }}
        className="rounded-b-3xl p-5"
      >
        <CalendarSlider
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
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
        className="absolute bottom-20 right-5 bg-orange-500 rounded-full items-center justify-center shadow-strong"
      >
        <Text style={{ fontSize: hp(4) }} className="text-white">+</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View
        style={{ backgroundColor: theme.colors.primary }}
        className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center h-16 rounded-t-3xl"
      >
        <TouchableOpacity>
          <FontAwesome name="home" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/activePrescriptions")}>
          <MaterialCommunityIcons name="pill" size={35} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/userSettings")}>
          <FontAwesome name="user" size={35} color="gray" />
        </TouchableOpacity>
      </View>

      <ReactNativeModal isVisible={isModalVisible} animationIn={"fadeIn"}>
        <View className="bg-teal-50 rounded-xl pb-6">
          {/* Top control icons */}
          <View
            style={{ backgroundColor: theme.colors.primary }}
            className="flex-row justify-between items-center py-4 px-5 mb-4 rounded-t-xl"
          >
            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={moveToUpdatePrescription}>
                <FontAwesome name="pencil" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsAlertVisible(true)}
                className="ml-5"
              >
                <FontAwesome name="trash" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false);
                setSelectedPrescription({
                  id: "",
                  name: "",
                  time: "",
                  note: "",
                });
              }}
            >
              <FontAwesome name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View className="px-4">
            <Text
              style={{ fontSize: hp(2.3) }}
              className="font-bold text-center mb-3"
            >
              {selectedPrescription?.name}
            </Text>
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="event" size={20} color="black" />
              <Text style={{ fontSize: hp(1.9) }} className="ml-2">
                Scheduled for {selectedPrescription?.time} today
              </Text>
            </View>
            <View className="flex-row items-center mb-2 mt-1">
              <MaterialIcons
                name="chat-bubble-outline"
                size={20}
                color="black"
              />
              <Text style={{ fontSize: hp(1.9) }} className="ml-2">
                {selectedPrescription?.note}
              </Text>
            </View>
          </View>

          {/* Pills */}
          <PillList pills={pills} />
        </View>
      </ReactNativeModal>

      <ReactNativeModal isVisible={isAlertVisible}>
        <CustomAlert
          title="Prescription for headache"
          message="Do you want to delete this prescription? All future notifications will be deleted."
          btnConfirm="Delete"
          confirmTextColor="text-red-500"
          onCancel={() => setIsAlertVisible(false)}
          onConfirm={handleDeletePrescription}
        />
      </ReactNativeModal>
    </View>
  );
};