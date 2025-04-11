import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, FontAwesome, MaterialIcons, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { images } from '@/constants';
import ReactNativeModal from 'react-native-modal';
import { useAuth } from '@/hooks/useAuth';
import theme from '@/config/theme';
import MessageModal from '@/components/MessageModal';

export default function UserSettings() {
    const { logout, user, updateUserImage } = useAuth();
    const router = useRouter();
    const [avatarUrl, setAvatarUrl] = useState('');

    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('Error');

    const [warningModalVisible, setWarningModalVisible] = useState(false);

    //modal success
    const showSuccessModal = (message: string) => {
        setModalType('Success');
        setModalMessage(message);
        setMessageModalVisible(true);
        setAvatarModalVisible(false);
    };

    //modal loi
    const showErrorModal = (message: string) => {
        setModalType('Error');
        setModalMessage(message);
        setMessageModalVisible(true);
    };

    const handleImageUpdate = async (newImageUrl) => {
        if (user?.email) {
            try {
                await updateUserImage(user.email, newImageUrl);
                showSuccessModal('Success updating your image!');
            } catch (error) {
                console.error('Error updating user image:', error);
            }
        } else {
            console.log('User or email not found');
        }
    };

    const handleCustomAvatar = async () => {
        // kiem tra rong
        if (!avatarUrl.trim()) {
            showErrorModal('Please enter an image URL');
            return;
        }

        // kiem tra dinh dang URL
        if (!avatarUrl.startsWith('http://') && !avatarUrl.startsWith('https://')) {
            showErrorModal('Invalid URL, URL must start with http:// or https://');
            return;
        }

        // ham kiem tra cai hinh nay co ton tai k
        //neu lay duoc size (height, width) thi tra ve true, nguoc lai thi false
        try {
            const imageExists = await new Promise((resolve) => {
                Image.getSize(
                    avatarUrl,
                    () => resolve(true),
                    () => resolve(false)
                );
            });

            if (!imageExists) {
                showErrorModal('Cannot load image from this URL');
                return;
            }

            // pass het thi cap nhat hinh
            await handleImageUpdate(avatarUrl);
            showSuccessModal('Success updating your image!');
            setAvatarUrl('');

        } catch (error) {
            showErrorModal('Failed to verify image. Please try another URL.');
        }
    };


    const handleLogout = async () => {
        await logout();
    }

    return (
        <View className="flex-1 bg-teal-500">
            <View className="items-center mt-16">
                <View className="relative">
                    <Image
                        key={user?.userImage}
                        source={
                            user?.userImage
                                ? { uri: user.userImage }
                                : { uri: 'https://i.pinimg.com/736x/5b/e1/60/5be1600a425c908ce13373efd2874a42.jpg' } // ✅ đúng cú pháp
                        }
                        style={{ height: hp(18), width: hp(18) }}
                        className="rounded-full border-4 border-white"
                    />

                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: 10,
                            bottom: 2,
                            backgroundColor: 'white',
                            borderRadius: 50,
                            padding: 5,
                        }}
                        onPress={() => setAvatarModalVisible(true)}
                    >
                        <Ionicons name="images-outline" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="items-center">
                <Text className="text-white text-4xl font-bold mt-5">{user?.username}</Text>
            </View>

            <View
                className="flex-1 bg-white rounded-3xl mx-5 my-5"
                style={{ elevation: 10, shadowColor: '#000' }}
            >
                <TouchableOpacity
                    className="flex-row items-center p-6 border-b border-gray-300"
                    onPress={() => router.push('/editYourProfile')}
                >
                    <MaterialIcons name="edit" size={24} color="black" />
                    <Text className="text-xl ml-4 flex-1">Edit my profile</Text>
                    <AntDesign name="arrowright" size={24} color="gray" />
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center p-6 border-b border-gray-300"
                    onPress={() => router.push('/enterNewPassword')}
                >
                    <FontAwesome name="lock" size={24} color="black" />
                    <Text className="text-xl ml-6 flex-1">Change password</Text>
                    <AntDesign name="arrowright" size={24} color="gray" />
                </TouchableOpacity>

                <View className="items-center mt-10">
                    <Image
                        source={images.userSettings}
                        style={{ height: hp(30), width: hp(30) }}
                        resizeMode="contain"
                    />
                </View>

                <TouchableOpacity
                    className="bg-teal-500 rounded-full py-3 mt-2 mx-8"
                    onPress={() => setWarningModalVisible(true)}
                    >
                    <Text className="text-white text-center text-lg font-bold">Log out</Text>
                </TouchableOpacity>

                <ReactNativeModal
                    isVisible={avatarModalVisible}
                    onBackdropPress={() => setAvatarModalVisible(false)}
                    backdropOpacity={0.3}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                    <View className="bg-white rounded-3xl w-[90%] overflow-hidden">
                        <View className="bg-teal-500 py-4 rounded-t-3xl">
                            <Text className="text-white text-2xl font-bold text-center">Set your avatar</Text>
                        </View>

                        <View className="px-4 pt-5 pb-2">
                            {/* 2 hang moi hang 4 anh */}
                            <View className="flex-row justify-between mb-4">
                                <TouchableOpacity onPress={() => handleImageUpdate('https://i.pinimg.com/736x/4d/19/a0/4d19a0f93cdd02d2e9d3f9853d9f9034.jpg')}>
                                    <View style={{
                                        width: 60,
                                        height: 60,
                                        borderWidth: 2,
                                        borderColor: '#d1d5db',
                                        borderRadius: 17,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={images.avatar1} style={{ width: '100%', height: '100%' }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleImageUpdate('https://i.pinimg.com/736x/1f/db/1a/1fdb1a0847d402dc0796fe0396a24f35.jpg')}>
                                    <View style={{
                                        width: 60,
                                        height: 60,
                                        borderWidth: 2,
                                        borderColor: '#d1d5db',
                                        borderRadius: 17,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={images.avatar2} style={{ width: '100%', height: '100%' }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleImageUpdate('https://i.pinimg.com/474x/e8/08/4f/e8084fc33982be7a2b9031c50febe0c0.jpg')}>
                                    <View style={{
                                        width: 60,
                                        height: 60,
                                        borderWidth: 2,
                                        borderColor: '#d1d5db',
                                        borderRadius: 17,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={images.avatar3} style={{ width: '100%', height: '100%' }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleImageUpdate('https://i.pinimg.com/474x/45/78/e7/4578e766af8ec8d452b098ebf66d839a.jpg')}>
                                    <View style={{
                                        width: 60,
                                        height: 60,
                                        borderWidth: 2,
                                        borderColor: '#d1d5db',
                                        borderRadius: 17,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={images.avatar4} style={{ width: '100%', height: '100%' }} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row justify-between">
                                <TouchableOpacity onPress={() => handleImageUpdate('https://i.pinimg.com/474x/42/ef/33/42ef33d893091718f11fc98c88dcf3be.jpg')}>
                                    <View style={{
                                        width: 60,
                                        height: 60,
                                        borderWidth: 2,
                                        borderColor: '#d1d5db',
                                        borderRadius: 17,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={images.avatar5} style={{ width: '100%', height: '100%' }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleImageUpdate('https://i.pinimg.com/474x/0c/fc/56/0cfc562dc7db14053f14f7cac49c797e.jpg')}>
                                    <View style={{
                                        width: 60,
                                        height: 60,
                                        borderWidth: 2,
                                        borderColor: '#d1d5db',
                                        borderRadius: 17,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={images.avatar6} style={{ width: '100%', height: '100%' }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleImageUpdate('https://i.pinimg.com/474x/8b/97/61/8b9761de2cccda3f4855678d7d1bacca.jpg')}>
                                    <View style={{
                                        width: 60,
                                        height: 60,
                                        borderWidth: 2,
                                        borderColor: '#d1d5db',
                                        borderRadius: 17,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={images.avatar7} style={{ width: '100%', height: '100%' }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleImageUpdate('https://i.pinimg.com/474x/81/9e/77/819e771ac6dbff24255d3ad5f126d357.jpg')}>
                                    <View style={{
                                        width: 60,
                                        height: 60,
                                        borderWidth: 2,
                                        borderColor: '#d1d5db',
                                        borderRadius: 17,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={images.avatar8} style={{ width: '100%', height: '100%' }} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="h-px bg-gray-300 mx-4 my-4" />
                        <View className="w-full px-4 pt-5 pb-2">
                            <Text className="text-gray-600 mb-2">Enter image URL:</Text>
                            <TextInput
                                className="border border-gray-300 rounded-2xl px-4 py-3 text-base"
                                placeholder="https://example.com/avatar.jpg"
                                value={avatarUrl}
                                onChangeText={setAvatarUrl}
                                autoCapitalize="none"
                                keyboardType="url"
                                autoCorrect={false}
                                multiline={false}
                                numberOfLines={1}
                                scrollEnabled={true} //scroll ngang
                                style={{
                                    maxHeight: 50,
                                    textOverflow: 'ellipsis', //them dau ... neu dai qua
                                }}
                            />
                        </View>

                        <TouchableOpacity
                            className="flex-row items-center justify-center bg-teal-500 mx-6 my-4 py-3 rounded-2xl"
                            onPress={() => {
                                handleCustomAvatar();
                                setAvatarModalVisible(false);
                            }}
                        >
                            <Ionicons name="image-outline" size={24} color="white" />
                            <Text className="text-white text-lg font-bold ml-2">Set your own avatar</Text>
                        </TouchableOpacity>
                    </View>
                </ReactNativeModal>

                <MessageModal
                    visible={messageModalVisible}
                    onClose={() => {
                        setMessageModalVisible(false);
                    }}
                    message={modalMessage}
                    type={modalType}
                >
                </MessageModal>

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
                            Are you sure you want to exit?.
                        </Text>

                        <View className="w-full mt-6 space-y-3">
                            <TouchableOpacity
                                onPress={() => {
                                    setWarningModalVisible(false);
                                    handleLogout();
                                }}
                                className="bg-yellow-500 py-3 rounded-2xl items-center"
                            >
                                <Text className="text-white text-lg font-bold">Log Out</Text>
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
            </View>
            {/* Bottom Navigation Bar */}
            <View style={{ backgroundColor: theme.colors.primary }} className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center h-16 rounded-t-3xl">
                <TouchableOpacity onPress={() => router.push('/homePage')}>
                    <FontAwesome name="home" size={35} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="pill" size={35} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FontAwesome name="user" size={35} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
