import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useAuth } from '@/hooks/useAuth'
import theme from '@/config/theme';

export default function home() {
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  }
  return (
    <View className="flex-1 pl-9 pr-9 mt-5">
      <Text style={{ fontSize: hp(2) }} className="text-center font-semibold">
        Home
      </Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={{ width: wp(25), backgroundColor: theme.colors.primary }}
        className="p-4 mt-4 rounded-2xl"
      >
        <Text className="text-white font-bold text-sm text-center">Logout</Text>
      </TouchableOpacity>
    </View>
  )
}