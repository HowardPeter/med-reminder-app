import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import { images } from "@/constants";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import PrescriptionAccordion from "@/components/PrescriptionAccordion";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import theme from "@/config/theme";
import { useCrud } from "@/hooks/useCrud";
import { useAuth } from "@/hooks/useAuth";
import AntDesign from "@expo/vector-icons/AntDesign";
import Foundation from "@expo/vector-icons/Foundation";
import Loading from "@/components/loading";
import { Picker } from "@react-native-picker/picker";

export default function ActivePrescriptions() {
  const { user } = useAuth();
  const {
    fetchPrescriptionData,
    fetchPillsData,
    fetchPrescriptionDataForSearch,
  } = useCrud();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyWord, setKeyWord] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("1");
  const userId = user?.userId ?? "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const prescriptions = await fetchPrescriptionData(userId);

        // Fetch pills for each prescription
        const prescriptionsWithPills = await Promise.all(
          prescriptions.map(async (prescription: any) => {
            const pills = await fetchPillsData(prescription.id);
            return { ...prescription, pills };
          })
        );

        setPrescriptions(prescriptionsWithPills);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const prescriptions = await fetchPrescriptionData(userId);

      // Fetch pills for each prescription
      const prescriptionsWithPills = await Promise.all(
        prescriptions.map(async (prescription: any) => {
          const pills = await fetchPillsData(prescription.id);
          return { ...prescription, pills };
        })
      );

      setPrescriptions(prescriptionsWithPills);
      setLoading(false);
      // Reset the search keyword and selected frequency
      setSelectedFrequency("");
      setKeyWord("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //Hàm xử lý tìm kiếm theo tên thuốc và tần suất
  const handleSearch = async () => {
    //Kiểm tra xem có từ khóa tìm kiếm hay không
    if (!keyWord && selectedFrequency === "") {
      handleRefresh();
      return;
    }
    //Chuyển đổi tần suất thành số để tìm kiếm
    const frequencySelected =
      selectedFrequency === "No repeat"
        ? 0
        : selectedFrequency === "Every day"
        ? 1
        : 7;
    try {
      setLoading(true);
      const prescriptions = await fetchPrescriptionDataForSearch(
        userId,
        keyWord,
        frequencySelected
      );

      // Filter prescriptions based on the keyword
      const filteredPrescriptions = prescriptions.filter((prescription: any) =>
        prescription.name.toLowerCase().includes(keyWord.toLowerCase())
      );

      // Fetch pills for each filtered prescription
      const prescriptionsWithPills = await Promise.all(
        filteredPrescriptions.map(async (prescription: any) => {
          const pills = await fetchPillsData(prescription.id);
          return { ...prescription, pills };
        })
      );

      setPrescriptions(prescriptionsWithPills);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSelect = async (itemValue: any) => {
    if (itemValue === "") {
      return;
    }
    setPrescriptions([]); // Reset prescriptions when a new frequency is selected
    const frequencySelected =
      itemValue === "No repeat" ? 0 : itemValue === "Every day" ? 1 : 7;
    try {
      setLoading(true);
      const prescriptions = await fetchPrescriptionDataForSearch(
        userId,
        "",
        frequencySelected
      );

      // Filter prescriptions based on the keyword
      const filteredPrescriptions = prescriptions.filter((prescription: any) =>
        prescription.name.toLowerCase().includes(keyWord.toLowerCase())
      );

      // Fetch pills for each filtered prescription
      const prescriptionsWithPills = await Promise.all(
        filteredPrescriptions.map(async (prescription: any) => {
          const pills = await fetchPillsData(prescription.id);
          return { ...prescription, pills };
        })
      );

      setPrescriptions(prescriptionsWithPills);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <View
      style={{ backgroundColor: theme.colors.background }}
      className="flex-1"
    >
      <View
        //style={{ backgroundColor: theme.colors.primary }}
        className="rounded-b-3xl bg-white items-center justify-between"
      >
        <View className="px-5 flex-row items-center justify-center">
          <View className="w-[50%]">
            <Text className="text-black text-2xl font-bold">
              Your Prescription History
            </Text>
            <Text className="text-1xl">"All your prescriptions,</Text>
            <Text className="text-1xl">right at your fingertips."</Text>
          </View>
          <View className="w-[50%]">
            <View className="items-center justify-center">
              <Image
                source={images.vectorHistoryPrescription}
                style={{ width: 200, height: 150 }}
              />
            </View>
          </View>
        </View>

        <View className="mt-2 items-center justify-center">
          {/* Search bar */}
          <View className="w-[380] h-[60] flex-row px-5 py-2 items-center justify-between border border-[#aaaaaa] rounded-full">
            <View className="w-[300]">
              <TextInput
                placeholder="search by prescription name"
                placeholderTextColor={"#AAAAAA"}
                onChangeText={(text) => setKeyWord(text)}
                value={keyWord}
              ></TextInput>
            </View>
            <View>
              {/* Button search */}
              <TouchableOpacity>
                <AntDesign
                  className="px-3 py-3 rounded-full bg-[#AED6D2]"
                  name="search1"
                  size={22}
                  color="black"
                  onPress={handleSearch}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="flex-row py-3 px-3.5 items-center justify-end w-[400]">
          {/* Dropdown (Picker) */}
          <View className="">
            <View className="border border-[#aaaaaa] rounded-[100] bg-[#ffffff] ml-1">
              <Picker
                selectedValue={selectedFrequency}
                onValueChange={(itemValue) => {
                  handleSelect(itemValue), setSelectedFrequency(itemValue);
                }} // Cập nhật giá trị khi chọn
                style={{ width: "160", height: "50", color: "#000000" }}
                mode="dropdown" // Có thể chọn hiển thị theo kiểu dropdown
              >
                <Picker.Item label="Frequency" value="" />
                <Picker.Item label="No repeat" value="No repeat" />
                <Picker.Item label="Every day" value="Every day" />
                <Picker.Item label="Every week" value="Every week" />
              </Picker>
            </View>
          </View>
          {/* Button refresh */}
          <View className="ml-1">
            <TouchableOpacity>
              <Foundation
                className="px-4 py-3 rounded-full bg-[#AED6D2]"
                name="refresh"
                size={24}
                color="black"
                onPress={handleRefresh}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-1 pt-3">
        {loading ? <Loading /> : null}
        <FlatList
          data={prescriptions}
          keyExtractor={() => Math.random().toString()}
          renderItem={({ item }) => (
            <PrescriptionAccordion
              name={item?.name}
              time={item?.time.join(", ")}
              frequency={item?.frequency}
              note={item?.note}
              pills={item.pills ?? []}
            />
          )}
          contentContainerStyle={{ paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push("/addPrescription")}
        style={{ width: hp(7), height: hp(7) }}
        className="absolute bottom-20 right-5 bg-orange-500 rounded-full items-center justify-center shadow-strong"
      >
        <Text style={{ fontSize: hp(4) }} className="text-white">
          +
        </Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View
        style={{ backgroundColor: theme.colors.primary }}
        className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center h-16 rounded-t-3xl"
      >
        <TouchableOpacity onPress={() => router.push("/homePage")}>
          <FontAwesome name="home" size={35} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name="pill" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/userSettings")}>
          <FontAwesome name="user" size={35} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
