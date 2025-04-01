import { View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import "../../global.css";
import { Fontisto } from "@expo/vector-icons"
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth'
import { doc, setDoc, serverTimestamp, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import emailjs from '@emailjs/react-native';
import CustomKeyboardView from '@/components/CustomKeyboardView';

export default function ForgetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const { checkIfEmailExists } = useAuth();

  //ham tao ma tu OTP sau so random tu 100000 toi 900000
  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTPEmail = async (email: string) => {
    try {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); //tinh thoi gian expire ma sau 5 phut
      const formattedTime = expiresAt.toLocaleTimeString(); //format lai thoi gian cho no dep

      // chay bang EmailJS that
      await emailjs.send(
        'service_ljqfo7p',
        'template_rf7va6r',
        {
          passcode: otp, //ghep cac truong tuong ung voi template
          email: email,
          time: formattedTime //thoi gian het han
        },
        {
          publicKey: 'ZCUdPPfiDnWbrPeWO',
        }
      );

      // chay Test bang Alert
      console.log('Your OTP is:', otp);

      return otp; //tra otp ve de luu vao firebase
    } catch (err) {
      console.error('Failed to send OTP:', err);
      throw err;
    }
  }

  const handleCheckEmailExist = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setIsSending(true); //neu da gui ma OTP thi chay
    try {
      const exists = await checkIfEmailExists(email);

      if (exists) { //co email trong firebase thi thuc hien
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); //het hang ma otp sau 5p

        const otp = await sendOTPEmail(email); //thuc hien send OTP qua gmail

        await setDoc(doc(db, "otps", email), {
          otp,
          createdAt: serverTimestamp(),
          expiresAt: Timestamp.fromDate(expiresAt),
        });

        Alert.alert(
          "OTP Sent",
          `An OTP has been sent to ${email}. Please check your inbox.`
        );
        router.push({ pathname: "/otpVerified", params: { email } }); //day qua trang moi cung voi email

        //xoa otp sau 10 phut
        setTimeout(async () => {
          await deleteDoc(doc(db, "otps", email));
          console.log("OTP expired and deleted");
        }, 10 * 60 * 1000);
      } else {
        Alert.alert(
          "Email Verification Failed",
          "Email does not exist or is not valid, please check and try again!"
        );
      }
    } catch (error) {
    } finally {
      setIsSending(false); //neu sending khong dc thi boolean bang false tra ve loi
    }
  };


  return (
    <CustomKeyboardView>
      <View className="flex-1 px-7 mt-20">
        <View className='flex justify-center items-center'>
          <Image
            style={{ height: hp(35), width: hp(35), resizeMode: 'contain' }}
            source={require('../../assets/images/email-verify.png')}
          />
        </View>

        <Text
          className='text-black text-4xl font-bold mt-6 text-left pb-1'>
          Check your email
        </Text>
        <Text className='text-gray-500 text-lg text-left mt-2 w-3/4 pb-10'>
          We have sent a password recovery instruction to your email.
        </Text>

        <View className='w-full mt-6 mb-4 px-5 pb-50'>
          <Text className='text-black text-xl font-semibold mb-3'>Verified Email</Text>
          <View className='flex-row items-center border border-gray-300 rounded-2xl px-3 py-2 bg-white'>
            <Fontisto name="email" size={24} color="black" className="mr-3" />
            <TextInput
              onChangeText={setEmail}
              value={email}
              className='flex-1 text-black text-base'
              placeholder="Enter your email"
              placeholderTextColor="gray"
              multiline={false}
            />
          </View>
        </View>

        <View className="w-full items-center">
          <TouchableOpacity
            className="w-[90%] bg-teal-500 rounded-3xl py-3 mt-6 px-5 h-14 justify-center items-center"
            onPress={handleCheckEmailExist}
          >
            <Text className="text-white text-lg font-bold text-center">Verified my OTP</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="mt-4 items-center px-5 pt-">
          <Text
            onPress={() => router.push('/signIn')}
            className="text-gray-500 text-sm"
            style={{ textDecorationLine: 'underline', textDecorationStyle: 'solid' }}
          >I remember my password now!</Text>
        </TouchableOpacity>
      </View>
    </CustomKeyboardView>
  );
}