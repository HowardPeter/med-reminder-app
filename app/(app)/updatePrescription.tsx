import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons, Fontisto, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { images } from '@/constants';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import MedList from '@/components/MedList'
import Loading from '@/components/loading';
import MedicineTimePicker from '@/components/MedicineTimePicker';
import { Picker } from '@react-native-picker/picker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';

export default function UpdatePrescription() {
    const [ name, setName ] = useState("");
    const [ day, setDay ] = useState("");
    const [ time, setTime ] = useState("");
    const [selectedFrequency, setSelectedFrequency] = useState('Every day');
    const [ note, setNote ] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { idDocPrescription} = useLocalSearchParams();

    useEffect(() => {
      

    }, []);
    // Handle update prescription
    const handleUpdatePrescription = async () => {
        if (!name || !day  || !note) {
            Alert.alert('Update Prescription', 'Please fill all fields!');
            return;
        }
        setIsLoading(true);
        Alert.alert('Update Prescription', 'Update successfully!');
        console.log('Update Prescription', {
            name: name, day: day, time: time, frequency: selectedFrequency, note: note
        });
        setNullValue();
        setIsLoading(false);
    }
    const setNullValue = () => {
        setName("");
        setDay("");
        setTime("");
        setSelectedFrequency("Every day");
        setNote("");
    }
    return (
        <CustomKeyboardView>
            <View className='bg-[#E8F3F2]'>
                {/* Header */}
                <View className='bg-white'>
                    <View className='flex-row mt-[30] ml-[16] mr-[16] items-center justify-between'>
                        <TouchableOpacity
                            onPress={() => router.replace('/homePage')}
                        >
                            <Ionicons name="chevron-back" size={30} color="black" />  
                        </TouchableOpacity>
                        <View className='flex-row items-center'>
                            <Image 
                                source={images.logo}
                                style={{ width: 42, height: 42 }} 
                            />
                            <Text 
                                className="text-3xl font-bold text-[#04A996]" 
                                style={{ letterSpacing: 5, fontFamily: 'IstokWeb-Bold' }}
                            > 
                                PILLPALL
                            </Text>
                        </View>
                    </View>
                </View>
                <View className='bg-white rounded-bl-[70] rounded-br-[70]'>
                    <Text className='pt-[20] text-3xl font-bold text-[#000000] text-center'>
                        Update prescription
                    </Text>
                    <Text className='text-1xl text-[#908F8F] text-center mt-2 pb-[40]'>
                        "Keeping prescriptions accurate for better care."
                    </Text>
                </View>
                {/* Body */}
                <View className='items-center mt-5'>
                    {/* Name */}
                    <View>
                        <View className='w-full'>
                            <Text className='text-1xl font-bold text-[#000000]'>
                                Prescription name
                            </Text>
                        </View>
                        <View>
                            <View className='bg-white flex-row items-center border border-[#949494] rounded-[10] h-[50] w-[370] mt-2 px-4'>
                                <Ionicons name="medkit-outline" size={24} color="black" />
                                <TextInput
                                    onChangeText={setName}
                                    placeholder='Enter prescription name...'
                                    className='px-3 pr-3 text-[#000000] text-1xl w-full'
                                    >
                                </TextInput>
                            </View>
                        </View>
                    </View>
                    {/* Day */}
                    <View className='mt-3'>
                        <View className='w-full'>
                            <Text className='text-1xl font-bold text-[#000000]'>
                                Start date
                            </Text>
                        </View>
                        <View>
                            <View className='bg-white flex-row items-center border border-[#949494] rounded-[10] h-[50] w-[370] mt-2 px-4'>
                                <Fontisto name="date" size={24} color="black" />
                                <TextInput
                                    onChangeText={setDay}
                                    placeholder='01/01/2025'
                                    className='px-3 pr-3 text-[#000000] text-1xl w-full'
                                    >
                                </TextInput>
                            </View>
                        </View>
                    </View>
                    {/* Time */}
                    <View className='mt-3'>
                        <View className='w-full'>
                            <Text className='text-1xl font-bold text-[#000000]'>
                                Time of taking medicine
                            </Text>
                        </View>
                        {/* <View>
                            <View className='bg-white flex-row items-center border border-[#949494] rounded-[10] h-[50] w-[370] mt-2 px-4'>
                                <AntDesign name="clockcircleo" size={24} color="black" />
                                <TextInput
                                    onChangeText={setTime}
                                    placeholder='00:00:00 AM'
                                    className='px-3 pr-3 text-[#000000] text-1xl w-full'
                                    >
                                </TextInput>
                            </View>
                        </View> */}
                        <View className='w-full mt-2'>
                            <MedicineTimePicker 
                                initialTimes={['7:00', '11:00', '17:00']}
                                //onTimesChange={handleTimesChange}
                            />
                        </View>
                    </View>
                    {/* Frequency */}
                    <View className="mt-3">
                        <View className="w-full">
                            <Text className="text-1xl font-bold text-[#000000]">
                                Frequency of taking medication
                            </Text>
                        </View>

                        <View>
                            <View className="bg-white flex-row items-center border border-[#949494] rounded-[10] h-[60] w-[370] mt-2 px-4">
                                <EvilIcons name="refresh" size={24} color="black" />
                                
                                {/* Dropdown (Picker) */}
                                <Picker
                                    selectedValue={selectedFrequency}
                                    onValueChange={(itemValue) => setSelectedFrequency(itemValue)} // Cập nhật giá trị khi chọn
                                    style={{ width: '100%', height: '100%', color: '#000000' }}
                                    mode="dropdown" // Có thể chọn hiển thị theo kiểu dropdown
                                >
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
                            <Text className='text-1xl font-bold text-[#000000]'>
                                Prescription note
                            </Text>
                        </View>
                        <View>
                            <View className='bg-white flex-row items-center border border-[#949494] rounded-[10] h-[100] w-[370] mt-2 px-4'>
                                <FontAwesome name="sticky-note-o" size={24} color="black" />
                                <TextInput
                                    onChangeText={setNote}
                                    placeholder='Some notes...'
                                    className='px-3 pr-3 text-[#000000] text-1xl w-full'
                                    multiline={true}
                                    numberOfLines={5} // số dòng hiển thị sẵn, không giới hạn input
                                    textAlignVertical="top" // căn chữ lên đầu thay vì giữa
                                    >
                                </TextInput>
                            </View>
                        </View>
                    </View>
                    {/* Button Update */}
                    <View className='self-end w-full mt-3'>
                    {
                        isLoading ? 
                        <Loading size={hp(7)} />
                        :
                        <View> 
                            <TouchableOpacity 
                                onPress={handleUpdatePrescription}
                            >
                                <View className='bg-[#04A996] rounded-[20] h-[50] w-[150] items-center justify-center mt-5 mx-auto'>
                                    <Text className='text-white text-1xl font-bold'>
                                        Update
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                    </View>
                </View>
                {/* Footer */}
                <View>
                    <View className='ml-[21] mt-5'>
                        <Text className='text-2xl font-bold text-[#04A996]'>
                            Medication list
                        </Text>
                    </View>
                    {/* Danh sach thuoc */}
                    <View className='mt-3 ml-[21]'>
                        <MedList />
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    )
}
