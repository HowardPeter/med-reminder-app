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
import { useAuth } from '@/hooks/useAuth';
import MessageModal from '@/components/MessageModal';
import { Timestamp } from 'firebase/firestore';


export default function AddPrescription() {
    const [selectedFrequency, setSelectedFrequency] = useState('No repeat');
    const [isLoading, setIsLoading] = useState(false);
    //lay data 
    const [prescriptionName, setPrescriptionName] = useState('');
    const [startDate, setStartDate] = useState("");
    const [time, setTime] = useState<string[]>(['7:30', '11:30', '17:30']);

    const [note, setNote] = useState('');
    //modal
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    //modal loi
    const showErrorModal = (message: string) => {
        setModalMessage(message);
        setMessageModalVisible(true);
    };

    const { user } = useAuth()

    //ham xu ly chuyen doi du lieu tu ngay sang so 
    const frequencyMap: { [key: string]: number } = {
        'No repeat': 0,
        'Every day': 1,
        'Every week': 7,
    };


    const isValidAndNotPastDate = (dateString: string): { valid: boolean, message?: string } => {
        //kiem tra xem dung dinh dang dd/mm//yyyy khong
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(dateString)) {
            return { valid: false, message: 'Date does not fit the format dd/mm/yyyy' };
        }

        const [day, month, year] = dateString.split('/').map(Number);
        const inputDate = new Date(year, month - 1, day);

        //kiem tra xem ngay nay co ton tai khong VD: 31/02/2025
        if (
            inputDate.getDate() !== day ||
            inputDate.getMonth() !== month - 1 ||
            inputDate.getFullYear() !== year
        ) {
            return { valid: false, message: 'This day does not exist.' };
        }

        //kiem tra xem ngay nhap vao co nho hon ngay hom nay hien tai k
        const today = new Date();
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (inputDate < today) {
            return { valid: false, message: 'Date can not be earlier than today.' };
        }

        return { valid: true };
    };


    const handleAddPrescription = async () => {
        if (!prescriptionName || !startDate) {
            showErrorModal('Please fill all required fields');
            return;
        }

        const dateCheck = isValidAndNotPastDate(startDate);
        if (!dateCheck.valid) {
            showErrorModal(dateCheck.message ?? 'Invalid date');
            return;
        }

        if (!time || time.length === 0) {
            showErrorModal('Please add at least one time to take the medicine.');
            return;
        }
        
        setIsLoading(true);

        const newPrescription = {
            name: prescriptionName,
            startDate: convertToTimestamp(startDate),
            time,
            frequency: frequencyMap[selectedFrequency] ?? 0, //neu undefined hoac null thi mac dinh la 0
            note,
            createdAt: Timestamp.fromDate(new Date()),
            userId: user.uid,
        };

        function convertToTimestamp(dateString: string): Timestamp | null {
            try {
                // Tách ngày, tháng, năm từ chuỗi
                const [day, month, year] = dateString.split("/").map(Number);

                // Tạo đối tượng Date (lưu ý: month trong JavaScript bắt đầu từ 0)
                const date = new Date(year, month - 1, day);

                // Kiểm tra ngày hợp lệ
                if (isNaN(date.getTime())) {
                    throw new Error("Ngày không hợp lệ");
                }

                // Chuyển sang Firestore Timestamp
                return Timestamp.fromDate(date);
            } catch (error) {
                console.error("Lỗi chuyển đổi ngày:", error);
                return null;
            }
        }

        setPrescriptionName('');
        setStartDate('');
        setSelectedFrequency('No repeat');
        setNote('');
        setIsLoading(false)

        router.push({
            pathname: '/addPills',
            params: { prescriptionData: JSON.stringify(newPrescription) }, //truyen xuong local bang dang js    
        });
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
                                    value={prescriptionName}
                                    onChangeText={setPrescriptionName}
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
                                    value={startDate}
                                    onChangeText={setStartDate}
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
                                initialTimes={time}
                                onTimesChange={setTime}
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
                                    value={note}
                                    onChangeText={setNote}
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
                <MessageModal
                    visible={messageModalVisible}
                    onClose={() => setMessageModalVisible(false)}
                    message={modalMessage}
                    type='Error'
                />
            </View>
        </CustomKeyboardView>
    )
}

