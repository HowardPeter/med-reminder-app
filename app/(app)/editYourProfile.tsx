import { View, TouchableOpacity, Image, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Feather, Fontisto, Ionicons } from '@expo/vector-icons';
import { images } from '@/constants';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '@/hooks/useAuth';
import ReactNativeModal from 'react-native-modal';
import CustomKeyboardView from '@/components/CustomKeyboardView';


export default function EditYourProfile() {
    const { user, updateUserInfo } = useAuth()
    const router = useRouter();
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [isEditButtonVisible, setIsEditButtonVisible] = useState(false);

    useEffect(() => {
        if (user) {
            setNewName(user.username);
            setNewEmail(user.userEmail);
        }
    }, [user]);

    const handleConfirmEdit = async () => {
        const result = await updateUserInfo(newName, newEmail);
        if (result.success) {
            console.log("Update profile successfull!");
        } else {
            alert(result.msg);
        }
    };

    return (
        <CustomKeyboardView>
            <View className='flex-1 px-7 mt-10'>
                <TouchableOpacity onPress={() => router.push('/userSettings')}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <View className='flex justify-center items-center'>
                    <Image
                        style={{ height: hp(30), width: hp(30), resizeMode: 'contain' }}
                        source={images.editYourProfile}
                    />
                </View>
                <View className="flex-row items-center justify-between mt-4 pb-3">
                    <Text className='text-black text-4xl font-bold mt-4 text-left pb-1 ml-4'>
                        Edit your profile
                    </Text>


                    <TouchableOpacity
                        onPress={() => {
                            if (isEditable) {
                                setIsEditable(false);
                            } else {
                                setIsModalVisible(true);
                            }
                        }}>
                        <Feather name="edit" size={28} color="black" />
                    </TouchableOpacity>
                </View>
                <Text className='text-gray-500 text-lg ml-4 w-90'>
                    Change your personal information.
                </Text>
                <View className='w-full mt-10 mb-4 px-5 pb-50'>
                    <Text className='text-black text-xl font-semibold mb-3'>Name</Text>
                    <View className='flex-row items-center border border-gray-300 rounded-2xl px-3 py-2 bg-white'>
                        <Feather name="user" size={22} color={isEditable ? "black" : "gray"} className='ml-2 mr-2 items-center' />
                        <TextInput
                            className='flex-1 text-black text-base'
                            style={{ color: isEditable ? 'black' : 'gray' }}
                            placeholderTextColor="gray"
                            multiline={false}
                            editable={isEditable}
                            value={newName}
                            onChangeText={setNewName}
                        />
                    </View>
                </View>

                <View className='w-full mt-3 mb-4 px-5 pb-50'>
                    <Text className='text-black text-xl font-semibold mb-3'>Email</Text>
                    <View className='flex-row items-center border border-gray-300 rounded-2xl px-3 py-2 bg-white'>
                        <Fontisto name="email" size={24} color='gray' className="mr-3" />
                        <TextInput
                            className='flex-1 text-black text-base'
                            style={{ color: 'gray' }}
                            placeholderTextColor="gray"
                            multiline={false}
                            editable={false}
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />
                    </View>
                </View>

                <View className={`w-full items-center ${isEditButtonVisible ? 'visible' : 'invisible'}`}>
                    <TouchableOpacity
                        className="w-[90%] bg-teal-500 rounded-3xl py-3 mt-10 px-5 h-14 justify-center items-center"
                        onPress={() => {
                            handleConfirmEdit();
                            setIsEditable(false);
                            setIsEditButtonVisible(false)
                        }}
                    >
                        <Text className="text-white text-lg font-bold text-center">Edit my profile</Text>
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
                        <View className="absolute -top-12 bg-teal-500 h-24 w-24 rounded-full items-center justify-center shadow-lg">
                            <Feather name="edit" size={50} color="white" />
                        </View>

                        <Text className="text-xl font-bold text-center text-gray-800 mb-2">
                            Editable your profile?
                        </Text>
                        <Text className="text-center text-base text-gray-600">
                            Confirm for starting to edit your personal profile
                        </Text>

                        <View className="w-full mt-6 space-y-3">
                            <TouchableOpacity
                                onPress={() => {
                                    setIsEditable(true);
                                    setIsModalVisible(false);
                                    setIsEditButtonVisible(true);
                                }}
                                className="bg-teal-500 py-3 rounded-2xl items-center"
                            >
                                <Text className="text-white text-lg font-bold">Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setIsModalVisible(false);
                                }}
                                className="bg-gray-300 py-3 rounded-2xl items-center mt-6"
                            >
                                <Text className="text-black text-lg font-bold">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ReactNativeModal>
            </View>
        </CustomKeyboardView>
    )
}