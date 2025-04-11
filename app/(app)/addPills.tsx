import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { images } from '@/constants';
import { router, useLocalSearchParams } from 'expo-router';
import theme from '@/config/theme';
import PillCard from '@/components/PillCard';
import ReactNativeModal from 'react-native-modal';
import useCrud from '@/hooks/useCrud';
import { Picker } from '@react-native-picker/picker';
import MessageModal from '@/components/MessageModal';

const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => console.log(item.name)}>
        <PillCard
            name={item.name}
            type={item.type}
            dosage={item.dosage}
            icon={item.icon} />
    </TouchableOpacity>
);

const AddPills = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pillName, setPillName] = useState('');
    const [pillType, setPillType] = useState('pill');
    const [pillDosage, setPillDosage] = useState('');
    const [pillList, setPillList] = useState<any[]>([]);
    const [prescription, setPrescription] = useState<any | null>(null);

    const [modalType, setModalType] = useState('Error')
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    
    //modal success
    const showSuccessModal = (message: string) => {
        setModalType('Success');
        setModalMessage(message);
        setMessageModalVisible(true);
        setIsModalVisible(false);
    };

    //modal loi
    const showErrorModal = (message: string) => {
        setModalType('Error');
        setModalMessage(message);
        setMessageModalVisible(true);
    };

    const [warningModalVisible, setWarningModalVisible] = useState(false);

    const { prescriptionData } = useLocalSearchParams();

    const { addPrescription, addPillToPrescription } = useCrud();

    useEffect(() => {
        if (prescriptionData) {
            try {
                const parsed = JSON.parse(prescriptionData);
                setPrescription(parsed);
            } catch (error) {
                console.error("Invalid prescription data:", error);
            }
        }
    }, [prescriptionData]);
    

    const handleAddPill = () => {
        if (!pillName || !pillType) {
            showErrorModal("Please fill all fields");
            return;
        }

        if (!pillDosage) {
            showErrorModal("Please choose pill type!");
            return;
        }

        const newPill = {
            id: Date.now().toString() + Math.random().toString(36).substring(7), //FlatList can trich xuat 1 id duy nhat, nen phai tao id duy nhat cho thuoc
            name: pillName,
            type: pillType,
            dosage: pillDosage,
            icon: images.pill,
        };
        setPillList(prev => [...prev, newPill]);

        setPillName('');
        setPillType('pill');
        setPillDosage('');
    };

    const handleConfirm = async () => {
        if (pillList.length === 0) {
            showErrorModal('There is no pill yet!');
            return;
        }

        try {
            //b1: luu don thuoc
            const prescriptionId = await addPrescription(prescription);

            //b2: luu tung vien thuoc vao prescription
            await Promise.all(
                pillList.map(({ name, type, dosage }) =>
                    addPillToPrescription(prescriptionId, { name, type, dosage })
                )
            );
            showSuccessModal("Prescription and pills saved!");
        } catch (err) {
            Alert.alert("Error", "Failed to save prescription.");
        }
    };

    
    return (
        <View style={{ backgroundColor: theme.colors.accent }} className="flex-1 px-6 pt-8">
            <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={() => {
                    if (pillList.length > 0) {
                        setWarningModalVisible(true);
                    } else {
                        router.replace('/homePage');
                    }
                }}>
                    <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>

                <Text style={{ fontSize: hp(2.5) }} className="text-center font-semibold ml-2">Prescription for headache</Text>
            </View>

            <View className='flex-row mt-14 ml-2'>
                <Image source={images.pill2} className="w-12 h-12 self-start mb-4" />
                <Image source={images.injection} className="w-12 h-12 self-start mb-4" />
            </View>

            <Text style={{ fontSize: hp(3) }} className="font-semibold ml-2 mb-5">Add pills to your{'\n'}prescription</Text>

            {/* Pill List */}
            <View style={{ maxHeight: hp(55) }} className="bg-white rounded-2xl overflow-hidden mb-6">
                <FlatList
                    data={pillList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingVertical: 16 }}
                />
            </View>

            {/* Bottom Buttons */}
            <View className="flex-row justify-end items-center">
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    className="flex bg-orange-400 rounded-full w-12 h-12 justify-center items-center shadow-3xl">
                    <Text style={{ fontSize: hp(3.5) }} className="text-white">+</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{backgroundColor: theme.colors.primary}} className="px-6 py-3 rounded-full ml-5 shadow-xl">
                    <Text className="text-white font-semibold text-base">Confirm</Text>
                </TouchableOpacity>
            </View>
            <ReactNativeModal
                isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
                backdropOpacity={0.3}
                animationIn="zoomIn"
                animationOut="zoomOut"
                style={{ justifyContent: 'center', alignItems: 'center' }}
            >
                <View style={{
                    backgroundColor: 'white',
                    width: '90%',
                    borderRadius: 24,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 10
                }}>
                    {/* Header */}
                    <View className="bg-teal-500 py-5 px-6">
                        <Text className="text-white text-2xl font-bold text-center">Add Pill</Text>
                    </View>

                    {/* Body */}
                    <View className="px-6 pt-6 pb-4">
                        <TextInput
                            placeholder="Pill name"
                            value={pillName}
                            onChangeText={setPillName}
                            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-gray-50"
                        />

                        <TextInput
                            placeholder="Dosage"
                            value={pillDosage}
                            onChangeText={setPillDosage}
                            keyboardType="numeric"
                            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-gray-50"
                        />
                        <Picker
                            selectedValue={pillType}
                            onValueChange={(itemValue) => setPillType(itemValue)}
                            style={{ width: '100%', height: 60, color: '#000000', marginBottom: 16 }}
                            mode="dropdown"
                        >
                            <Picker.Item label="pill" value="pill" />
                            <Picker.Item label="inhaler" value="inhaler" />
                            <Picker.Item label="injection" value="injection" />
                            <Picker.Item label="syrup" value="syrup" />
                            <Picker.Item label="tablet" value="tablet" />
                        </Picker>

                        <TouchableOpacity
                            onPress={() => {
                                handleAddPill();
                                setIsModalVisible(false);
                            }}
                            className="py-3 rounded-full bg-teal-500 shadow-md"
                        >
                            <Text className="text-white text-center font-semibold text-base">Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ReactNativeModal>

            <MessageModal
                visible={messageModalVisible}
                onClose={() => {
                    setMessageModalVisible(false);
                    if (modalType === 'Success') {
                        router.push('/homePage');
                    }
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
                        Are you sure you want to exit? Your unsaved prescription will be lost.
                    </Text>

                    <View className="w-full mt-6 space-y-3">
                        <TouchableOpacity
                            onPress={() => {
                                setWarningModalVisible(false);
                                router.replace('/homePage')
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

        </View>
    );
};

export default AddPills;                