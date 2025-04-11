import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { images } from "@/constants";
import { router } from "expo-router";
import theme from "@/config/theme";
import PillCard from "@/components/PillCard";
import { useLocalSearchParams } from "expo-router";
import { useCrud } from "@/hooks/useCrud";
import Loading from "@/components/loading";
import ReactNativeModal from "react-native-modal";
import CustomAlert from "@/components/CustomAlert";

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
const AddPills = () => {
  const { getPrescriptionPills, deletePillById } = useCrud();
  const params = useLocalSearchParams();
  const { prescriptionId } = params;
  const [pills, setPills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pillName, setPillName] = useState("");
  const [pillType, setPillType] = useState("pill");
  const [pillDosage, setPillDosage] = useState("");
  const [pillId, setPillId] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        setPillName(item.name);
        setPillType(item.type);
        setPillDosage(item.dosage);
        setPillId(item.id);
        setIsAlertVisible(true);
      }}
    >
      <PillCard
        name={item.name}
        type={item.type}
        dosage={item.dosage}
        icon={getPillIcon(item.type)}
      />
    </TouchableOpacity>
  );
  //Ham xoa 1 thuoc trong don thuoc
  const deletePill = async () => {
    try {
      // 1. Thực hiện xóa pill
      await deletePillById(prescriptionId.toString(), pillId);

      // 2. Ẩn alert
      setIsAlertVisible(false);

      // 3. Load lại danh sách pill
      setLoading(true);
      const updatedPills = await getPrescriptionPills(prescriptionId);
      setPills(updatedPills);
    } catch (error) {
      console.error("Lỗi khi xóa pill:", error);
      Alert.alert("Lỗi", "Không thể xóa thuốc: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPills = async () => {
      try {
        const pillsData = await getPrescriptionPills(prescriptionId);
        setPills(pillsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPills();
  }, [prescriptionId]);
  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Loading size={hp(14)} />
      </View>
    );
  return (
    <View
      style={{ backgroundColor: theme.colors.accent }}
      className="flex-1 px-6 pt-8"
    >
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>
        <Text
          style={{ fontSize: hp(2.5) }}
          className="text-center font-semibold ml-2"
        >
          Prescription for headache
        </Text>
      </View>

      {/* Illustration */}
      <View className="flex-row mt-14 ml-2">
        <Image source={images.pill2} className="w-12 h-12 self-start mb-4" />
        <Image
          source={images.injection}
          className="w-12 h-12 self-start mb-4"
        />
      </View>

      {/* Title */}
      <Text style={{ fontSize: hp(3) }} className="font-semibold ml-2 mb-5">
        Add pills to your{"\n"}prescription
      </Text>

      {/* Pill List */}
      <View
        style={{ maxHeight: hp(55) }}
        className="bg-white rounded-2xl overflow-hidden mb-6"
      >
        <FlatList
          data={pills}
          renderItem={renderItem}
          keyExtractor={() => Math.random().toString()}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      </View>

      {/* Bottom Buttons */}
      <View className="flex-row justify-end items-center">
        <TouchableOpacity className="flex bg-orange-400 rounded-full w-12 h-12 justify-center items-center shadow-3xl">
          <Text style={{ fontSize: hp(3.5) }} className="text-white">
            +
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: theme.colors.primary }}
          className="px-6 py-3 rounded-full ml-5 shadow-xl"
        >
          <Text className="text-white font-semibold text-base">Confirm</Text>
        </TouchableOpacity>
      </View>
      <ReactNativeModal isVisible={isAlertVisible}>
        <CustomAlert
          title="Delete Pill"
          message="Do you want to delete this pill?"
          btnConfirm="Delete"
          confirmTextColor="text-red-500"
          onCancel={() => setIsAlertVisible(false)}
          onConfirm={deletePill}
        />
      </ReactNativeModal>
    </View>
  );
};

export default AddPills;
