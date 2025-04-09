import { View, Text, Image, TextInput, TouchableOpacity, LogBox } from 'react-native'
import React, { useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather, Ionicons } from '@expo/vector-icons';
import { images } from '@/constants';
import { useRouter } from 'expo-router';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import ReactNativeModal from 'react-native-modal';
import CustomKeyboardView from '@/components/CustomKeyboardView';

export default function EnterNewPassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIcon, setModalIcon] = useState('alert-circle');
    const [modalColor, setModalColor] = useState('bg-red-500');
    const [modalTitle, setModalTitle] = useState<'Success' | 'Warning' | 'Error'>('Error');

    const modalButtonTextMap = {
        Success: 'Great!',
        Warning: 'I Understand',
        Error: 'Try Again',
    };
    
    const modalButtonText = modalButtonTextMap[modalTitle];
    

    //modal thanh cong
    const showSuccessModal = (message: string) => {
        setModalIcon('check-circle');
        setModalColor('bg-teal-500');
        setModalTitle('Success');
        setModalMessage(message);
        setIsModalVisible(true);
    };

    //modal loi
    const showErrorModal = (message: string) => {
        setModalIcon('alert-circle');
        setModalColor('bg-red-500');
        setModalTitle('Error');
        setModalMessage(message);
        setIsModalVisible(true);
    };

    const handleChangePassword = async () => {
        const hasSpecialChar = /[^a-zA-Z0-9]/;

        if (!oldPassword || !newPassword || !confirmPassword) {
            showErrorModal('Please fill all the information.');
            return;
        }


        if (hasSpecialChar.test(newPassword) || hasSpecialChar.test(confirmPassword)) {
            showErrorModal('Password must not contain special characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            showErrorModal('New password do not match with confirm password.');
            return;
        }

        if (newPassword.length < 6) {
            showErrorModal('Password must have at least six letters.');
            return;
        }

        if (newPassword == oldPassword) {
            showErrorModal('New password must be different with old password.');
            return;
        }

        try {

            const currentUser = auth.currentUser;

            if (!currentUser?.email) {
                showErrorModal('No authenticated user found.');
                return;
            }

            //loi credential neu mat khau nhap vao sai
            //method: tat console log cua du an
            const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
            console.log(`credentia: ${credential}`)
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);

            showSuccessModal('Password change successfull!');
        } catch (error) {
            console.error('Lỗi đổi mật khẩu:', error.message);
            if (error.code === 'auth/invalid-credential') {
                showErrorModal('Old password is wrong or invalid.');
            } else {
                showErrorModal('Something went wrong please try again.');
            }
        }
    };

    const router = useRouter();

    
    //tat console log
    LogBox.ignoreAllLogs(true);

    return (
        <CustomKeyboardView>
            <View className='flex-1 px-7 mt-10'>
                <TouchableOpacity onPress={() => router.push('/userSettings')}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <View className='flex justify-center items-center'>
                    <Image
                        style={{ height: hp(30), width: hp(30), resizeMode: 'contain' }}
                        source={images.changePassword}
                    />
                </View>
                <Text className='text-black text-4xl font-bold mt-4 text-left pb-3 ml-4'>
                    Change your password
                </Text>
                <Text className='text-gray-500 text-lg ml-4 w-90'>
                    Enter a new <Text className="text-teal-500 font-bold">password</Text> to change password.
                </Text>

                <View className='w-full mt-6 mb-4 px-5 pb-50'>
                    <Text className='text-black text-xl font-semibold mb-3'>Old password</Text>
                    <View className='flex-row items-center border border-gray-300 rounded-2xl px-3 py-2 bg-white'>
                        <Feather name="unlock" size={24} color="black" className="mr-3" />
                        <TextInput
                            secureTextEntry={!oldPasswordVisible}
                            className='flex-1 text-black text-base'
                            placeholder="Enter old password"
                            placeholderTextColor="gray"
                            multiline={false}
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />
                        <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)} className='mr-2'>
                            <Feather name={oldPasswordVisible ? "eye-off" : "eye"} size={18} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='w-full mt-3 mb-4 px-5 pb-50'>
                    <Text className='text-black text-xl font-semibold mb-3'>New password</Text>
                    <View className='flex-row items-center border border-gray-300 rounded-2xl px-3 py-2 bg-white'>
                        <Feather name="unlock" size={24} color="black" className="mr-3" />
                        <TextInput
                            secureTextEntry={!newPasswordVisible}
                            className='flex-1 text-black text-base'
                            placeholder="Enter new password"
                            placeholderTextColor="gray"
                            multiline={false}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)} className='mr-2'>
                            <Feather name={newPasswordVisible ? "eye-off" : "eye"} size={18} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='w-full mt-3 mb-4 px-5 pb-50'>
                    <Text className='text-black text-xl font-semibold mb-3'>Confirm password</Text>
                    <View className='flex-row items-center border border-gray-300 rounded-2xl px-3 py-2 bg-white'>
                        <Feather name="unlock" size={24} color="black" className="mr-3" />
                        <TextInput
                            secureTextEntry={!confirmPasswordVisible}
                            className='flex-1 text-black text-base'
                            placeholder="Enter confirm password"
                            placeholderTextColor="gray"
                            multiline={false}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className='mr-2'>
                            <Feather name={confirmPasswordVisible ? "eye-off" : "eye"} size={18} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="w-full items-center">
                    <TouchableOpacity
                        className="w-[90%] bg-teal-500 rounded-3xl py-3 mt-3 px-5 h-14 justify-center items-center"
                        onPress={handleChangePassword}
                    >
                        <Text className="text-white text-lg font-bold text-center">Change password</Text>
                    </TouchableOpacity>
                </View>

                <ReactNativeModal
                    isVisible={isModalVisible}
                    onBackdropPress={() => setIsModalVisible(false)}
                    backdropOpacity={0.7}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                    <View className="bg-white rounded-2xl w-[90%] pt-16 pb-6 px-6 items-center relative">
                        <View className={`absolute -top-12 ${modalColor} h-24 w-24 rounded-full items-center justify-center shadow-lg`}>
                            <Feather name={modalIcon} size={50} color="white" />
                        </View>

                        <Text className="text-xl font-bold text-center text-gray-800 mb-2">
                            {modalTitle}
                        </Text>
                        <Text className="text-center text-base text-gray-600">
                            {modalMessage}
                        </Text>

                        <View className="w-full mt-6 space-y-3">
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                className={`${modalColor} py-3 rounded-2xl items-center`}
                            >
                                <Text className="text-white text-lg font-bold">
                                    {modalButtonText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ReactNativeModal>
            </View>
        </CustomKeyboardView>
    )
}