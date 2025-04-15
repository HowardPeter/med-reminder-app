import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import CustomKeyboardView from '@/components/CustomKeyboardView';
import theme from '@/config/theme';
import CheckBox from '@/components/CheckBox';
import { Link, router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/loading';
import { ReactNativeModal } from "react-native-modal";
import { images } from '@/constants';

export default function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const [userRegister, setUserRegister] = useState<{ data?: { reload: () => Promise<void>; emailVerified?: boolean; email?: string } } | null>(null);

  const userNameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const [verification, setVerification] = useState({
    state: "default",
  });

  const handlePasswordConfirmation = () => {
    if (passwordRef.current === "" || confirmPasswordRef.current === "") {
      setIsPasswordConfirmed(true);
      return;
    }
    // Check if the password and confirm password match
    if (passwordRef.current !== confirmPasswordRef.current) {
      setIsPasswordConfirmed(false);
    } else {
      setIsPasswordConfirmed(true);
    }
  }

  const handleSignUpPress = async () => {
    if (!userNameRef.current || !emailRef.current || !passwordRef.current || !confirmPasswordRef.current) {
      Alert.alert('Sign Up', 'Please fill all fields!');
      return;
    }

    if (!isChecked || !isPasswordConfirmed) {
      return;
    }
    setIsLoading(true);

    const response = await register(userNameRef.current, emailRef.current, passwordRef.current);
    setUserRegister(response);

    setIsLoading(false)

    if (!response.success) {
      Alert.alert('Sign Up', response.msg);
    }
    else {
      setVerification({
        state: "pending",
      });
    }
  }

  const checkVerification = async () => {
    try {
      await userRegister?.data?.reload();
      let emailVerified = userRegister?.data?.emailVerified;
      console.log("Checking emailVerified:", emailVerified)

      if (emailVerified) {
        setVerification({ state: "success" });
        console.log("Verification state updated!");
      }
      else {
        Alert.alert('Your email has not verified yet!', 'Check your email or resend OTP to verify your email.')
      }
    } catch (error) {
      console.error("Error checking verification:", error);
    }
  };
  console.log("user.register: ", userRegister);

  return (
    <CustomKeyboardView>
      <View className="bg-white flex-1 px-9 justify-center w-full h-screen">
        {/* Back Button */}
        <View style={{ marginTop: hp(-5) }} className='flex-row justify-between mb-9'>
          <Link href="/(auth)/signIn" style={{ maxWidth: wp(10) }}>
            <Ionicons name="chevron-back" size={32} color="black" />
          </Link>
          <Image
            source={images.logoTrans}
            className='w-[43px] h-[43px] rounded-xl'
          />
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
              onChangeText={value => userNameRef.current = value}
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
              onChangeText={value => emailRef.current = value}
              placeholder="ex: jonsmith@gmail.com"
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
              onChangeText={text => {
                passwordRef.current = text;
              }}
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
          <View>
            <Text style={styles.inputText} className={`mb-2 ${isPasswordConfirmed ? 'text-black' : 'text-red-600'}`}>Confirm password</Text>
            <View className={`flex-row items-center border-2 ${isPasswordConfirmed ? 'border-gray-300' : 'border-red-600'} rounded-2xl p-1.5`}>
              <Octicons name="lock" size={22} color={"black"} className="ml-2 mr-2" />
              <TextInput
                onChangeText={text => {
                  confirmPasswordRef.current = text;
                  handlePasswordConfirmation();
                }}
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
        </View>

        {/* Terms and Policy */}
        <View className="flex-row items-center mb-4">
          <CheckBox isChecked={isChecked} onToggle={() => setIsChecked(!isChecked)} size={24} color={theme.colors.primary} />
          <Text className='ml-1'>
            I understood the <Text style={{ color: theme.colors.primary }} className="font-semibold">terms & policy</Text>
          </Text>
        </View>

        {/* Sign Up Button */}
        <View>
          {isLoading ?
            <View className='flex-row justify-center'>
              <Loading size={hp(7)} />
            </View>
            :
            <TouchableOpacity onPress={handleSignUpPress} style={{ backgroundColor: theme.colors.primary }} className="p-4 rounded-3xl items-center">
              <Text className="text-white font-bold text-lg">Sign Up</Text>
            </TouchableOpacity>
          }
        </View>

        {/* Sign In Link */}
        <View>
          <Text style={{ fontSize: hp(2) }} className="text-center font-semibold text-gray-400 mt-4">
            Have an account?
            <Link href="/(auth)/signIn">
              <Text style={{ color: theme.colors.primary }} className="font-semibold">
                {' '}Sign In
              </Text>
            </Link>
          </Text>
        </View>

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          animationIn={"slideInRight"}
          animationOut={"slideOutRight"}
          style={{ margin: 0 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ backgroundColor: "white" }} className='flex-1 text-center px-7'>
              {/* Back Button */}
              <View style={{ marginTop: hp(3), maxWidth: wp(10) }} className='mb-5'>
                <TouchableOpacity onPress={() => setVerification({ state: "default" })}>
                  <Ionicons name="chevron-back" size={32} color="black" />
                </TouchableOpacity>
              </View>

              <View className='flex items-center mt-15'>
                <Image
                  style={{ height: hp(35), width: hp(35), resizeMode: 'contain' }}
                  source={require('../../assets/images/verify-email.png')}
                />
              </View>

              <View className="w-full items-center mt-9">
                <Text style={{ fontSize: wp(5.5) }} className='font-semibold'>Confirm your email address</Text>
                <Text style={{ fontSize: wp(4.3) }} className="text-gray-500 text-center w-90 mt-3">
                  We sent a confirmation email to your email:
                </Text>
                <Text style={{ fontSize: wp(4.3), color: theme.colors.primary }} className="mt-2 font-bold">{userRegister?.data?.email}</Text>
                <Text style={{ fontSize: wp(4.3) }} className='text-gray-500 text-center text-lg mt-2'>Check your email and click on the confirmation link to continue.</Text>
              </View>

              <View className="flex-row justify-between mt-[170px] pb-11">
                <TouchableOpacity>
                  <Text style={{ fontSize: wp(4.3), color: theme.colors.primary }} className="font-bold">Resend</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={checkVerification}>
                  <Text style={{ fontSize: wp(4.3), color: theme.colors.primary }} className="font-bold">CONFIRM</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ReactNativeModal>

        <ReactNativeModal
          isVisible={verification.state === "success"}
          animationIn={"slideInUp"}
        >
          <View style={{ backgroundColor: theme.colors.primary }} className='flex items-center w-[350px] h-[340px] rounded-2xl'>
            <Image
              source={require('../../assets/images/Verify.png')}
              style={{ width: hp(11), height: hp(11) }}
              className='mt-12'
            />
            <View className='flex justify-center items-center mt-5'>
              <Text style={{ fontSize: wp(5.5) }} className='text-white font-bold text-center'>Verified!</Text>
              <Text style={{ fontSize: wp(4.2) }} className='text-white font-medium text-center text-lg mt-2'>Congratulation! You have successfully verify your email.</Text>
            </View>
            <TouchableOpacity onPress={() => router.replace('/(app)/homePage')} className='bg-white py-4 px-[100px] rounded-3xl items-center mt-10'>
              <Text style={{ fontSize: wp(4), color: theme.colors.primary }} className='font-semibold'>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
      </View>
    </CustomKeyboardView>
  )
}

const styles = {
  inputText: {
    fontSize: hp(2.1),
  },
  input: {
    height: hp(5.5),
    fontSize: hp(2.1),
  }
}