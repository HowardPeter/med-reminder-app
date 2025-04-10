import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, Fontisto, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { images } from '@/constants';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import Loading from '@/components/loading';
import MedicineTimePicker from '@/components/MedicineTimePicker';
import { Picker } from '@react-native-picker/picker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { router } from 'expo-router';
import theme from '@/config/theme';

export default function AddPrescription() {
    const [selectedFrequency, setSelectedFrequency] = useState('Every day');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddPrescription = async () => {
        setIsLoading(true);
        router.push('/addPills');
        setIsLoading(false);
    }

    return (
        <CustomKeyboardView>
            <View style={{ backgroundColor: theme.colors.accent }} className='flex-1 mb-7 h-screen'>
                {/* Header */}
                <View className='bg-white'>
                    <View className='flex-row mt-[20] mx-[16] items-center justify-between'>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={30} color="black" />
                        </TouchableOpacity>
                        <View className='flex-row items-center'>
                            <Image
                                source={images.logo}
                                style={{ width: 42, height: 42 }}
                            />
                            <Text
                                className="text-3xl font-bold"
                                style={{ color: theme.colors.primary, letterSpacing: 5, fontFamily: 'IstokWeb-Bold' }}
                            >
                                PILLPALL
                            </Text>
                        </View>
                    </View>
                </View>
                <View className='bg-white rounded-bl-[70] rounded-br-[70]'>
                    <Text className='pt-[20] text-3xl font-bold text-black text-center'>
                        Add new prescription
                    </Text>
                    <Text className='text-1xl text-gray-700 text-center mt-2 pb-[40]'>
                        "Keeping prescriptions accurate for better care."
                    </Text>
                </View>
                {/* Body */}
                <View className='items-center mt-5'>
                    {/* Name */}
                    <View>
                        <View className='w-full'>
                            <Text className='text-1xl font-bold'>
                                Prescription name
                            </Text>
                        </View>
                        <View>
                            <View className='bg-white flex-row items-center border border-gray-400 rounded-[10] h-[50] w-[370] mt-2 px-4'>
                                <Ionicons name="medkit-outline" size={24} color="black" />
                                <TextInput
                                    placeholder='Enter prescription name...'
                                    className='px-3 pr-3 text-1xl w-full'
                                >
                                </TextInput>
                            </View>
                        </View>
                    </View>
                    {/* Day */}
                    <View className='mt-3'>
                        <View className='w-full'>
                            <Text className='text-1xl font-bold'>
                                Start date
                            </Text>
                        </View>
                        <View>
                            <View className='bg-white flex-row items-center border border-gray-400 rounded-[10] h-[50] w-[370] mt-2 px-4'>
                                <Fontisto name="date" size={24} color="black" />
                                <TextInput
                                    placeholder='01/01/2025'
                                    className='px-3 pr-3 text-1xl w-full'
                                >
                                </TextInput>
                            </View>
                        </View>
                    </View>
                    {/* Time */}
                    <View className='mt-3'>
                        <View className='w-full'>
                            <Text className='text-1xl font-bold'>
                                Time of taking medicine
                            </Text>
                        </View>
                        <View className='w-full mt-2'>
                            <MedicineTimePicker
                                initialTimes={['7:00', '11:00', '17:00']}
                            //onTimesChange={handleTimesChange}
                            />
                            <Text style={{ fontSize: hp(1.8) }} className='italic text-base text-center'>Note: Times must be at least 1 hour apart</Text>
                        </View>
                    </View>
                    {/* Frequency */}
                    <View className="mt-3">
                        <View className="w-full">
                            <Text className="text-1xl font-bold">
                                Frequency of taking medication
                            </Text>
                        </View>

                        <View>
                            <View className="bg-white flex-row items-center border border-gray-400 rounded-[10] h-[60] w-[370] mt-2 px-4">
                                <EvilIcons name="refresh" size={24} color="black" />

                                {/* Dropdown (Picker) */}
                                <Picker
                                    selectedValue={selectedFrequency}
                                    onValueChange={(itemValue) => setSelectedFrequency(itemValue)} // Cập nhật giá trị khi chọn
                                    style={{ width: '100%', height: '100%', color: '#000000' }}
                                    mode="dropdown" // Có thể chọn hiển thị theo kiểu dropdown
                                >
                                    <Picker.Item label="No repeat" value="No repeat" />
                                    <Picker.Item label="Every day" value="Every day" />
                                    <Picker.Item label="Every week" value="Every week" />
                                    {/* <Picker.Item label="Every year" value="Every year" /> */}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    {/* note */}
                    <View className='mt-3'>
                        <View className='w-full'>
                            <Text className='text-1xl font-bold'>
                                Prescription note
                            </Text>
                        </View>
                        <View>
                            <View className='bg-white flex-row items-center border border-gray-400 rounded-[10] h-[100] w-[370] mt-2 px-4'>
                                <FontAwesome name="sticky-note-o" size={24} color="black" />
                                <TextInput
                                    placeholder='Some notes...'
                                    className='px-3 pr-3 text-1xl w-full'
                                    multiline={true}
                                    numberOfLines={5} // số dòng hiển thị sẵn, không giới hạn input
                                    textAlignVertical="top" // căn chữ lên đầu thay vì giữa
                                >
                                </TextInput>
                            </View>
                        </View>
                    </View>
                    {/* Button Update */}
                    <View className='self-end w-full mt-2'>
                        {isLoading ?
                            <Loading size={hp(7)} />
                            :
                            <View className="items-end mr-5">
                                <TouchableOpacity
                                    style={{ backgroundColor: theme.colors.primary }}
                                    className="flex rounded-[20] h-[50] w-[140] justify-center mt-5"
                                    onPress={handleAddPrescription}
                                >
                                    <Text className="text-white text-xl text-center font-bold">Add</Text>
                                </TouchableOpacity>
                            </View>

                        }
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    )
}
