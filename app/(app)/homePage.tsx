import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "@/config/theme";
import { useAuth } from "@/hooks/useAuth";
import CalendarSlider from "@/components/CalendarSlider";
import { SafeAreaView } from "react-native-safe-area-context";
import PrescriptionList from "@/components/PrescriptionList";

const HomePage = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <View style={{ backgroundColor: theme.colors.background }} className="flex-1">
      {/* Header Section */}
      <SafeAreaView style={{ backgroundColor: theme.colors.primary }} className="rounded-b-3xl p-5">
        <CalendarSlider />
      </SafeAreaView>

      {/* Body */}
      <PrescriptionList />

      {/* Floating Action Button */}
      <TouchableOpacity
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
        <TouchableOpacity onPress={handleLogout}>
          <FontAwesome name="user" size={35} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomePage;