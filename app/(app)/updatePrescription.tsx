import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, Fontisto, EvilIcons, FontAwesome } from "@expo/vector-icons";
import { images } from "@/constants";
import CustomKeyboardView from "@/components/CustomKeyboardView";
import Loading from "@/components/loading";
import MedicineTimePicker from "@/components/MedicineTimePicker";
import { Picker } from "@react-native-picker/picker";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import theme from "@/config/theme";
import { db } from "@/firebaseConfig";
import { format } from "date-fns";

export default function UpdatePrescription() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState("1");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oldData, setOldData] = useState<string[]>([]);
  const [timeOld, setTimeOld] = useState<string[]>([]);
  const { prescriptionId } = useLocalSearchParams();

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      if (!prescriptionId) return;

      try {
        setIsLoading(true);
        // Lấy dữ liệu prescription chính
        const prescriptionRef = doc(db, "prescriptions", prescriptionId);
        const prescriptionSnap = await getDoc(prescriptionRef);
        
        //Lấy dữ liệu prescription chính
        if (prescriptionSnap.exists()) {
          const prescriptionData = prescriptionSnap.data();
          //Gán dữ liệu vào các biến
          setName(prescriptionData.name ?? "");
          const rawStartDate = prescriptionData.startDate;

          // Kiểm tra và chuyển đổi nếu cần
          let convertedDate: Date | null = null;
        
          if (rawStartDate instanceof Timestamp) {
            convertedDate = rawStartDate.toDate();
          } else if (rawStartDate?.seconds) {
            // Nếu là plain object { seconds, nanoseconds }
            convertedDate = new Timestamp(rawStartDate.seconds, rawStartDate.nanoseconds).toDate();
          }
        
          // Nếu có ngày hợp lệ thì format
          if (convertedDate) {
            setStartDate(format(convertedDate, "dd/MM/yyyy"));
          } else {
            setStartDate(""); // hoặc giữ nguyên nếu không hợp lệ
          } 
          const numberOfFrequency = prescriptionData.frequency?.toString();
          if (numberOfFrequency === "0") {
            setSelectedFrequency("No repeat");
          } else if (numberOfFrequency === "7") {
            setSelectedFrequency("Every week");
          } else if (numberOfFrequency === "1") {
            setSelectedFrequency("Every day");
          }
          setTimes(prescriptionData.time ?? []);
          setNote(prescriptionData.note ?? "");
          //Tao mot mang string
          const oldDataArray: string[] = [
            name,
            startDate,
            numberOfFrequency,
            note,
          ];
          setOldData(oldDataArray);
          setTimeOld(prescriptionData.time ?? []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptionData();
  }, [prescriptionId]);
  //Ham cap nhat don thuoc
  const handleUpdatePrescription = async () => {
    const number =
      selectedFrequency === "No repeat"
        ? 0
        : selectedFrequency === "Every week"
        ? 7
        : 1;
    const newDataArray: string[] = [name, startDate, number.toString(), note];
    if (
      JSON.stringify(oldData) === JSON.stringify(newDataArray) &&
      JSON.stringify(times) === JSON.stringify(timeOld)
    ) {
      Alert.alert("Error", "No changes detected!");
      return;
    }
    if (!name || !startDate || !note || times.length === 0) {
      Alert.alert("Error", "Please fill all required fields!");
      return;
    }
    const isDateValid = isValidDate(startDate);
    if (!isDateValid) {
      return; // Ngừng thực hiện nếu ngày không hợp lệ
    }
    setIsLoading(true);
    try {
      // Cập nhật prescription chính
      const prescriptionRef = doc(db, "prescriptions", prescriptionId);
      await updateDoc(prescriptionRef, {
        name: name,
        startDate: convertToTimestamp(startDate),
        time: times,
        note: note,
        frequency:
          selectedFrequency === "No repeat"
            ? 0
            : selectedFrequency === "Every week"
            ? 7
            : 1,
      });
      Alert.alert("Success", "Prescription updated successfully!");
      setOldData(newDataArray);
      //router.back();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimesChange = (newTimes: string[]) => {
    setTimes(newTimes);
  };
  // Hàm kiểm tra định dạng ngày tháng
  const isValidDate = (dateString: string): boolean => {
    // Kiểm tra định dạng ngày
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      Alert.alert("Invalid Format", "Please enter date in DD/MM/YYYY format");
      return false;
    }

    // Tách ngày, tháng, năm
    const [day, month, year] = dateString.split("/").map(Number);

    // Kiểm tra giá trị ngày tháng hợp lệ
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
      Alert.alert("Invalid Date", "Please enter a valid date");
      return false;
    }

    // Tạo đối tượng Date
    const inputDate = new Date(year, month - 1, day);

    // Kiểm tra ngày hợp lệ (tránh trường hợp 31/02/2023)
    if (
      inputDate.getFullYear() !== year ||
      inputDate.getMonth() !== month - 1 ||
      inputDate.getDate() !== day
    ) {
      Alert.alert("Invalid Date", "The date doesn't exist");
      return false;
    }

    // Kiểm tra ngày quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bỏ qua giờ phút để chỉ so sánh ngày

    if (inputDate < today) {
      Alert.alert("Past Date", "Start date cannot be in the past");
      return false;
    }

    return true;
  };
  function convertToTimestamp(dateString: string): Timestamp | null {
    try {
      // Tách ngày, tháng, năm từ chuỗi
      const [day, month, year] = dateString.split("/").map(Number);

      // Tạo đối tượng Date (lưu ý: month trong JavaScript bắt đầu từ 0)
      const date = new Date(year, month - 1, day);

      // Kiểm tra ngày hợp lệ
      if (isNaN(date.getTime())) {
        throw new Error("Ngày không hợp lệ");
      }

      // Chuyển sang Firestore Timestamp
      return Timestamp.fromDate(date);
    } catch (error) {
      console.error("Lỗi chuyển đổi ngày:", error);
      return null;
    }
  }
  return (
    <CustomKeyboardView>
      <View className="bg-[#E8F3F2]">
        {/* Header */}
        <View className="bg-white">
          <View className="flex-row mt-[30] ml-[16] mr-[16] items-center justify-between">
            <TouchableOpacity onPress={() => router.replace("/homePage")}>
              <Ionicons name="chevron-back" size={30} color="black" />
            </TouchableOpacity>
            <View className="flex-row items-center">
              <Image source={images.logo} style={{ width: 42, height: 42 }} />
              <Text
                className="text-3xl font-bold"
                style={{
                  color: theme.colors.primary,
                  letterSpacing: 5,
                  fontFamily: "IstokWeb-Bold",
                }}
              >
                PILLPALL
              </Text>
            </View>
          </View>
        </View>
        <View className="bg-white rounded-bl-[70] rounded-br-[70]">
          <Text className="pt-[20] text-3xl font-bold text-black text-center">
            Update prescription
          </Text>
          <Text className="text-1xl text-gray-700 text-center mt-2 pb-[40]">
            "Keeping prescriptions accurate for better care."
          </Text>
        </View>
        {/* Body */}
        <View className="items-center mt-5">
          {/* Name */}
          <View>
            <View className="w-full">
              <Text className="text-1xl font-bold text-black">
                Prescription name
              </Text>
            </View>
            <View>
              <View className="bg-white flex-row items-center border border-gray-400 rounded-[10] h-[50] w-[370] mt-2 px-4">
                <Ionicons name="medkit-outline" size={24} color="black" />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter prescription name..."
                  className="px-3 pr-3 text-black text-1xl w-full"
                ></TextInput>
              </View>
            </View>
          </View>
          {/* Day */}
          <View className="mt-3">
            <View className="w-full">
              <Text className="text-1xl font-bold text-black">Start date</Text>
            </View>
            <View>
              <View className="bg-white flex-row items-center border border-gray-400 rounded-[10] h-[50] w-[370] mt-2 px-4">
                <Fontisto name="date" size={24} color="black" />
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="01/01/2025"
                  className="px-3 pr-3 text-black text-1xl w-full"
                ></TextInput>
              </View>
            </View>
          </View>
          {/* Time */}
          <View className="mt-3">
            <View className="w-full">
              <Text className="text-1xl font-bold text-black">
                Time of taking medicine
              </Text>
            </View>
            <View className="w-full mt-2">
              <MedicineTimePicker
                initialTimes={times} // Pass the actual array, not the setter
                onTimesChange={handleTimesChange}
              />
            </View>
          </View>
          {/* Frequency */}
          <View className="mt-3">
            <View className="w-full">
              <Text className="text-1xl font-bold text-black">
                Frequency of taking medication
              </Text>
            </View>

            <View>
              <View className="bg-white flex-row items-center border border-gray-400 rounded-[10] h-[60] w-[370] mt-2 px-4">
                <EvilIcons name="refresh" size={24} color="black" />

                {/* Dropdown (Picker) */}
                <Picker
                  selectedValue={selectedFrequency}
                  onValueChange={(itemValue) => setSelectedFrequency(itemValue)} // Cập nhật giá trị khi chọn
                  style={{ width: "100%", height: "100%", color: "#000000" }}
                  mode="dropdown" // Có thể chọn hiển thị theo kiểu dropdown
                >
                  <Picker.Item label="No repeat" value="No repeat" />
                  <Picker.Item label="Every day" value="Every day" />
                  <Picker.Item label="Every week" value="Every week" />
                </Picker>
              </View>
            </View>
          </View>
          {/* note */}
          <View className="mt-3">
            <View className="w-full">
              <Text className="text-1xl font-bold text-black">
                Prescription note
              </Text>
            </View>
            <View>
              <View className="bg-white flex-row items-center border border-gray-400 rounded-[10] h-[100] w-[370] mt-2 px-4">
                <FontAwesome name="sticky-note-o" size={24} color="black" />
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Some notes..."
                  className="px-3 pr-3 text-black text-1xl w-full"
                  multiline={true}
                  numberOfLines={5} // số dòng hiển thị sẵn, không giới hạn input
                  textAlignVertical="top" // căn chữ lên đầu thay vì giữa
                ></TextInput>
              </View>
            </View>
          </View>
          {/* Button Update */}
          <View className="items-center mt-3 flex-row">
            {isLoading ? (
              <Loading size={hp(7)} />
            ) : (
              <View className="pr-5 mb-10">
                <TouchableOpacity
                  className="flex border border-400 border-[#04A996] rounded-[20] h-[50] w-[140] justify-center mt-5"
                  onPress={() =>
                    router.push({
                      pathname: "/addPills",
                      params: { prescriptionId: prescriptionId },
                    })
                  }
                >
                  <Text className="text-[#04A996] text-xl text-center font-bold">
                    Update Pills
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {isLoading ? (
              <Loading size={hp(7)} />
            ) : (
              <View className="pl-5 mb-10">
                <TouchableOpacity
                  style={{ backgroundColor: theme.colors.primary }}
                  className="flex rounded-[20] h-[50] w-[140] justify-center mt-5"
                  onPress={handleUpdatePrescription}
                >
                  <Text className="text-white text-xl text-center font-bold">
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}