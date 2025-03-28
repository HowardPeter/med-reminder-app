import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import CustomKeyboardView from '@/components/CustomKeyboardView';
import theme from '@/config/theme';
import CheckBox from '@/components/CheckBox';
import { Link } from 'expo-router';

export default function signUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <CustomKeyboardView>
      <View style={{ backgroundColor: theme.colors.background }} className="flex-1 pl-9 pr-9 justify-center w-screen h-screen">
        {/* Back Button */}
        <View style={{ marginTop: hp(-7) }} className='flex-row justify-between mb-9'>
          <Link href="/(auth)/signIn" style={{ maxWidth: wp(10) }}>
            <Ionicons name="arrow-back-circle-outline" size={40} color="black" />
          </Link>
          {/* <Image
            source={require('../../assets/images/logo.jpg')}
            className='w-[43px] h-[43px] rounded-xl'
          /> */}
        </View>

        {/* Title */}
        <View className='mb-5'>
          <Text className="text-3xl font-bold">Create a new {'\n'}account</Text>
        </View>

        {/* Name Input */}
        <View className='mb-4'>
          <Text style={styles.inputText} className="mb-2">Name</Text>
          <View className="flex-row items-center border-2 border-gray-300 rounded-2xl p-1.5">
            <Feather name="user" size={22} color="black" className="ml-2 mr-2" />
            <TextInput
              placeholder="ex: Jon Smith"
              style={styles.input}
              className="flex-1" />
          </View>
        </View>

        {/* Email Input */}
        <View className='mb-4'>
          <Text style={styles.inputText} className="mb-2">Email</Text>
          <View className="flex-row items-center border-2 border-gray-300 rounded-2xl p-1.5">
            <Octicons name="mail" size={22} color="black" className="ml-2 mr-2" />
            <TextInput
              placeholder="ex: jon.smith@gmail.com"
              style={styles.input}
              multiline={false}
              className="flex-1"
              keyboardType="email-address" />
          </View>
        </View>

        {/* Password Input */}
        <View className='mb-4'>
          <Text style={styles.inputText} className="mb-2">Password</Text>
          <View className="flex-row items-center border-2 border-gray-300 rounded-2xl p-1.5">
            <Octicons name="lock" size={22} color="black" className="ml-2 mr-2" />
            <TextInput
              placeholder="********"
              secureTextEntry={!passwordVisible}
              style={styles.input}
              className="flex-1"
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} className='mr-2'>
              <Feather name={passwordVisible ? "eye-off" : "eye"} size={18} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View className='mb-4'>
          <Text style={styles.inputText} className="mb-2">Confirm password</Text>
          <View className="flex-row items-center border-2 border-gray-300 rounded-2xl p-1.5">
            <Octicons name="lock" size={22} color="black" className="ml-2 mr-2" />
            <TextInput
              placeholder="********"
              secureTextEntry={!confirmPasswordVisible}
              style={styles.input}
              className="flex-1"
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className='mr-2'>
              <Feather name={confirmPasswordVisible ? "eye-off" : "eye"} size={18} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms and Policy */}
        <View className="flex-row items-center mb-4">
          <CheckBox isChecked={isChecked} onToggle={() => setIsChecked(!isChecked)} size={24} color={theme.colors.primary} />
          <Text className='ml-1'>
            I understood the <Text style={{ color: theme.colors.primary }} className="font-semibold">terms & policy</Text>
          </Text>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity className="bg-teal-500 p-4 rounded-3xl items-center">
          <Text className="text-white font-bold text-lg">Sign Up</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <Text style={{ fontSize: hp(2) }} className="text-center font-semibold text-gray-400 mt-4">
          Have an account?
          <Link href="/(auth)/signIn">
            <Text style={{ color: theme.colors.primary }} className="font-semibold">
              {' '}Sign In
            </Text>
          </Link>
        </Text>
      </View>
    </CustomKeyboardView>
  )
}

const styles = {
  inputText: {
    fontSize: hp(2.1),
  },
  input: {
    maxHeight: hp(5.5),
    fontSize: hp(2.1),
  }
}