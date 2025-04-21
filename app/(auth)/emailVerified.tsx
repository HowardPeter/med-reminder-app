import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import "../../global.css";
import { Fontisto } from "@expo/vector-icons"
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth'
import { doc, setDoc, serverTimestamp, deleteDoc, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import emailjs from '@emailjs/react-native';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { images } from '@/constants';
import Loading from '@/components/loading';
import MessageModal from '@/components/MessageModal';

export default function ForgetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const { checkIfEmailExists } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState('Error')
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showSuccessModal = (message: string) => {
    setModalType('Success');
    setModalMessage(message);
    setMessageModalVisible(true);
  };

  //modal loi
  const showErrorModal = (message: string) => {
    setModalType('Error');
    setModalMessage(message);
    setMessageModalVisible(true);
  };

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
    setIsLoading(true);

    if (!email) {
      showErrorModal("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      const exists = await checkIfEmailExists(email);

      if (!exists) {
        showErrorModal(
          "Email does not exist or is not valid, please check and try again!"
        );
        setIsLoading(false);
        return;
      }

      //kiem tra xem OTP cu con ton tai k
      const otpRef = doc(db, "otps", email);
      const otpDoc = await getDoc(otpRef);

      if (otpDoc.exists()) { //neu co ma OTP
        const otpData = otpDoc.data();
        const expiresAt = otpData.expiresAt.toDate(); //chuyen timestamp tren firestore ve dang date
        const now = new Date();

        if (expiresAt > now) { //neu ma OTP van con thoi gian 
          const remainingTime = Math.ceil((expiresAt.getTime() - now.getTime()) / 1000);
          showErrorModal(
            `An OTP has already been sent. Please wait ${remainingTime} seconds before trying again.`
          );
          setIsLoading(false);
          return;
        }

        //OTP het han thi xoa no di
        await deleteDoc(otpRef);
      }

      //khoi tao OTP moi
      const newOtp = await sendOTPEmail(email);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); //OTP se het han sau 5 phut

      await setDoc(otpRef, {
        otp: newOtp,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt),
      });

      showSuccessModal(`An OTP has been sent to ${email}. Please check your inbox.`) //sau khi kiem tra thay ok co email thi gui OTP va chuyen sang trang nhap ma OTP
      setIsLoading(false);
      // xoa OTP sau 5 phut
      setTimeout(async () => {
        await deleteDoc(otpRef);
        showErrorModal("OTP expired and deleted, please verified your email again.");
        router.replace('/(auth)/emailVerified');
      }, 5 * 60 * 1000);
    } catch (error) {
      console.error("Error checking email and sending OTP:", error);
      setIsLoading(false);
    }
  };

  return (
    <CustomKeyboardView>
      <View className="flex-1 px-7 mt-20">
        <View className='flex justify-center items-center'>
          <Image
            style={{ height: hp(35), width: hp(35), resizeMode: 'contain' }}
            source={images.emailVerified}
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
        {isLoading ?
          <View className='items-center px-5 ml-5'>
            <Loading size={hp(7)} />
          </ View>
          :
          <View className="w-full items-center">
            <TouchableOpacity
              className="w-[90%] bg-teal-500 rounded-3xl py-3 mt-6 px-5 h-14 justify-center items-center"
              onPress={handleCheckEmailExist}
            >
              <Text className="text-white text-lg font-bold text-center">Verified my OTP</Text>
            </TouchableOpacity>
          </View>
        }

        <TouchableOpacity className="mt-4 items-center px-5 pt-">
          <Text
            onPress={() => router.push('/signIn')}
            className="text-gray-500 text-sm"
            style={{ textDecorationLine: 'underline', textDecorationStyle: 'solid' }}
          >I remember my password now!</Text>
        </TouchableOpacity>
      </View>

      <MessageModal
        visible={messageModalVisible}
        onClose={() => {
          setMessageModalVisible(false);
          if (modalType === 'Success') {
            router.push({ pathname: "/otpVerified", params: { email } });
          }
        }}
        message={modalMessage}
        type={modalType}
      >
      </MessageModal>

    </CustomKeyboardView>
  );
}