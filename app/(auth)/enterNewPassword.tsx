import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import CustomKeyboardView from '@/components/CustomKeyboardView';


export default function enterNewPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const { email } = useLocalSearchParams();
    const { changePassword } = useAuth();
    const router = useRouter();

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Please enter both password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters.");
            return;
        }
        try {
            await changePassword(email, newPassword);
            Alert.alert("Success", "Your password has been changed successfully.", [
                { text: "OK", onPress: () => router.push("/signIn") }
            ]);
        } catch (error) {
            Alert.alert("Error", error.message + "Something went wrong. Failed to change password.");
        }
    };

    return (
        <CustomKeyboardView>

            <View className='flex-1 px-7 mt-10'>
                <View className='flex justify-center items-center'>
                    <Image
                        style={{ height: hp(35), width: hp(35), resizeMode: 'contain' }}
                        source={require('../../assets/images/Reset_password-pana.png')}
                    />
                </View>
                <Text className='text-black text-4xl font-bold mt-6 text-left pb-3'>
                    Change your password
                </Text>
                <Text className='text-gray-500 text-lg text-center w-90'>
                    Enter a new <Text className="text-teal-500 font-bold">password</Text> to change password.
                </Text>

                <View className='w-full mt-10 mb-4 px-5 pb-50'>
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

                <View className='w-full mt-6 mb-4 px-5 pb-50'>
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
                        className="w-[90%] bg-teal-500 rounded-3xl py-3 mt-10 px-5 h-14 justify-center items-center"
                        onPress={handleChangePassword}
                    >
                        <Text className="text-white text-lg font-bold text-center">Change password</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomKeyboardView>
    )
}