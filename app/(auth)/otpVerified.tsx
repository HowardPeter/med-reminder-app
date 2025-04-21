import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MessageModal from '../../components/MessageModal';
import { db } from '../../firebaseConfig';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { images } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import ReactNativeModal from 'react-native-modal';
import Loading from '@/components/loading';

export default function VertifiedOTP() {
  const router = useRouter();
  const otpRefs = useRef<(TextInput | null)[]>([]);

  //vi email lay tu useLocalSearch params la string[] nen khi truyen vao email phai tra ve dang string
  //o day se viet mot cai ham chuyen tu array ve string lai
  const { email } = useLocalSearchParams();
  const emailString = Array.isArray(email) ? email[0] : email ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('Error');
  const [warningModalVisible, setWarningModalVisible] = useState(false);

  //modal success
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

  const [otpInput, setOtpInput] = useState(["", "", "", "", "", ""]);
  const otpFields = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'];

  const { resetPassword } = useAuth();

  // xu ly va gop OTP tu cac input thanh mot chuoi
  const handleOTPChange = (text: string, index: number) => {
    let newOtp = [...otpInput];
    newOtp[index] = text;
    setOtpInput(newOtp);

    // Nếu có nhập và không phải ô cuối cùng -> Chuyển focus sang ô tiếp theo
    if (text && index < otpInput.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    // Nếu xóa số và không phải ô đầu tiên -> Quay lại ô trước
    if (!text && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    const enteredOTP = otpInput.join(""); // ghép các số lại thành chuỗi OTP

    try {
      console.log("Fetching OTP for email:", email);

      const otpDoc = await getDoc(doc(db, "otps", email.toString()));

      //khong thay otp 
      if (!otpDoc.exists()) {
        showErrorModal("No OTP found for this email.");
        setIsLoading(false);
        return;
      }

      const data = otpDoc.data();
      const storedOTP = data.otp;
      const expiresAt = data.expiresAt.toDate();
      const now = new Date();

      // otp het han
      if (now > expiresAt) {
        await deleteDoc(doc(db, "otps", email.toString()));
        showErrorModal("Expired OTP, The OTP has expired. Please request a new one.");
        setIsLoading(false);
        return;
      }

      //otp khonh khop
      if (enteredOTP !== storedOTP) {
        showErrorModal("Invalid OTP, The OTP you entered is incorrect. Please try again.");
        setIsLoading(false);

        // otp tu xoa
        setTimeout(async () => {
          await deleteDoc(doc(db, "otps", email.toString()));
          showErrorModal("OTP expired and deleted after 1 minute");
          router.replace('/emailVerified');
        }, 60 * 1000);

        return;
      }

      //otp dung
      showSuccessModal("Verified successfull, please check your email for password reset link...");
      await deleteDoc(doc(db, "otps", email.toString()));
      resetPassword(emailString);
      setIsLoading(false);
      return;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showErrorModal("An error occurred while verifying OTP.");
      setIsLoading(false);
      return;
    }
  };


  return (
    <CustomKeyboardView>
      <View className='flex-1 px-7 mt-10'>
        <TouchableOpacity onPress={() => {
          setWarningModalVisible(true);
        }}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>

        <View className='flex justify-center items-center mt-15'>
          <Image
            style={{ height: hp(35), width: hp(35), resizeMode: 'contain' }}
            source={images.forgotPassword}
          />
        </View>

        <View className="w-full items-center mt-20">
          <Text className="text-gray-500 text-lg text-center w-90">
            Please enter the verification code we sent
          </Text>
          <Text className="text-gray-500 text-lg text-center w-90">
            to your email <Text className="text-teal-500 font-bold">{email}</Text>
          </Text>
        </View>

        <View className="justify-center items-center mt-16 mx-2">
          <View className="flex-row">
            {otpFields.map((id, index) => (
              <TextInput
                key={id}
                ref={(el) => (otpRefs.current[index] = el)}
                style={{ width: wp(12), height: hp(7) }}
                className="text-center text-lg text-black border border-gray-500 rounded-2xl bg-white mx-2"
                maxLength={1}
                keyboardType="number-pad"
                value={otpInput[index]}
                onChangeText={(text) => handleOTPChange(text, index)}
              />
            ))}
          </View>
        </View>
        {isLoading ?
          <View>
            <Loading size={hp(7)} />
          </View>
          :
          <View className="w-full items-center mt-10">
            <TouchableOpacity
              className="w-[90%] bg-teal-500 rounded-3xl py-3 mt-10 px-5 h-14 justify-center items-center"
              onPress={handleVerifyOTP}
            >
              <Text className="text-white text-lg font-bold text-center">Verified</Text>
            </TouchableOpacity>
          </View>
        }


        <MessageModal
          visible={messageModalVisible}
          onClose={() => {
            setMessageModalVisible(false);
            if (modalType === 'Success') {
              router.replace('/signIn')
            }
          }}
          message={modalMessage}
          type={modalType}
        >
        </MessageModal>
      </View>
      <ReactNativeModal
        isVisible={warningModalVisible}
        onBackdropPress={() => setWarningModalVisible(false)}
        backdropOpacity={0.7}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View className="bg-white rounded-2xl w-[90%] pt-16 pb-6 px-6 items-center relative">
          <View className="absolute -top-12 bg-yellow-500 h-24 w-24 rounded-full items-center justify-center shadow-lg">
            <Feather name="alert-triangle" size={50} color="white" />
          </View>

          <Text className="text-xl font-bold text-center text-gray-800 mb-2">
            Warning
          </Text>
          <Text className="text-center text-base text-gray-600">
            Are you sure you want to exit? It will take time to resend your OTP.
          </Text>

          <View className="w-full mt-6 space-y-3">
            <TouchableOpacity
              onPress={() => {
                setWarningModalVisible(false);
                router.replace('/otpVerified')
              }}
              className="bg-yellow-500 py-3 rounded-2xl items-center"
            >
              <Text className="text-white text-lg font-bold">Exit Anyway</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setWarningModalVisible(false)}
              className="bg-gray-200 py-3 rounded-2xl items-center mt-3"
            >
              <Text className="text-gray-700 text-lg font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ReactNativeModal>
    </CustomKeyboardView>

  );
}
