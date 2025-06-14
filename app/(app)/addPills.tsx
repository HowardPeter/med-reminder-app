import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { images } from '@/constants';
import { router, useLocalSearchParams } from 'expo-router';
import theme from '@/config/theme';
import PillCard from '@/components/PillCard';
import ReactNativeModal from 'react-native-modal';
import { useCrud } from '@/hooks/useCrud';
import { Picker } from '@react-native-picker/picker';
import MessageModal from '@/components/MessageModal';
import Loading from '@/components/loading';
import CustomAlert from "@/components/CustomAlert";

const getPillIcon = (type: string) => {
    switch (type) {
        case "pill":
            return images.pill;
        case "inhaler":
            return images.inhaler;
        case "injection":
            return images.injection;
        default:
            return images.pill;
    }
};

const AddPills = () => {
    const { getPrescriptionPills, deletePillById } = useCrud();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pillName, setPillName] = useState('');
    const [pillType, setPillType] = useState('pill');
    const [pillDosage, setPillDosage] = useState('');

    //tach 2 cai list ra
    const [newPillList, setNewPillList] = useState<any[]>([]); //list nay danh cho addPrescription
    const [existingPillList, setExistingPillList] = useState<any[]>([]); //list nay danh cho updatePrescription

    const [prescription, setPrescription] = useState<any | null>(null);
    const [modalType, setModalType] = useState('Error')
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const params = useLocalSearchParams();
    const { prescriptionId } = params;
    const [pillId, setPillId] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const { prescriptionData } = useLocalSearchParams();
    const { addPrescription, addPillToPrescription } = useCrud();

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

    //useEffect set state, khi co prescriptionData thi xai newPillList va nguoc lai
    useEffect(() => {
        if (prescriptionData) {
            // We're creating a new prescription
            try {
                const parsed = JSON.parse(prescriptionData);
                setPrescription(parsed);
            } catch (error) {
                console.error("Invalid prescription data:", error);
            }
        } else if (prescriptionId) {
            // We're updating an existing prescription
            const fetchPills = async () => {
                try {
                    setIsLoading(true);
                    const pillsData = await getPrescriptionPills(prescriptionId);
                    setExistingPillList(pillsData);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchPills();
        }
    }, [prescriptionData, prescriptionId]);

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
            icon: getPillIcon(pillType),
        };

        //phan dieu kien de them va list
        if (prescriptionData) {
            setNewPillList(prev => [...prev, newPill]);
        } else if (prescriptionId) {
            setExistingPillList(prev => [...prev, newPill]);
        }

        setPillName('');
        setPillType('pill');
        setPillDosage('');
        setIsModalVisible(false);
    }

    const handleConfirm = async () => {
        const currentPillList = prescriptionData ? newPillList : existingPillList;
        if (currentPillList.length === 0) {
            showErrorModal('There is no pill yet!');
            return;
        }
        try {
            setIsLoading(true);
            if (prescriptionData) {

                //b1: luu don thuoc
                const prescriptionId = await addPrescription(prescription);

                //b2: luu tung vien thuoc vao prescription
                await Promise.all(
                    newPillList.map(({ name, type, dosage }) =>
                        addPillToPrescription(prescriptionId, { name, type, dosage })
                    )
                );

                showSuccessModal("Prescription and pills saved!");
            } else if (prescriptionId) {
                //lay danh sach pills hien tai co trong firebase
                const originalPills = await getPrescriptionPills(prescriptionId);

                //tim toan bo cac pill da them vao pillList 
                const newPills = existingPillList.filter(updatedPill =>
                    !originalPills.some(originalPill => originalPill.id === updatedPill.id)
                );

                //tim toan bo cac pill da xoa khoi pillList 
                const deletedPills = originalPills.filter(originalPill =>
                    !existingPillList.some(updatedPill => updatedPill.id === originalPill.id)
                );

                //xoa pills do tren firebase neu co
                await Promise.all(
                    deletedPills.map(pill => deletePillById(prescriptionId.toString(), pill.id))
                );

                //chi them pill moi neu co 
                await Promise.all(
                    newPills.map(({ name, type, dosage }) =>
                        addPillToPrescription(prescriptionId, { name, type, dosage })
                    )
                );

                showSuccessModal('Pills updated successfully!');
            }
        } catch (err) {
            Alert.alert("Error", `Failed to save: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    //Ham xoa 1 thuoc trong don thuoc (chua xoa tren firebase)
    const deletePill = (pillIdToDelete: string) => {
        setIsAlertVisible(false);

        if (prescriptionData) {
            //xoa tren danh sach moi
            setNewPillList(prev => prev.filter(pill => pill.id !== pillIdToDelete));
        } else if (prescriptionId) {
            //xoa tren danh sach cu
            setExistingPillList(prev => prev.filter(pill => pill.id !== pillIdToDelete));
        }
    };

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            onPress={() => {
                setPillName(item.name);
                setPillType(item.type);
                setPillDosage(item.dosage);
                setPillId(item.id);
                setIsAlertVisible(true);
            }}
        >
            <PillCard
                name={item.name}
                type={item.type}
                dosage={item.dosage}
                icon={getPillIcon(item.type)}
            />
        </TouchableOpacity>
    );

    if (isLoading)
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Loading size={hp(14)} />
            </View>
        );
    //xacs dinh list hien tai la newPillList hay la existingPillList dua tren prescriptionData
    const currentPillList = prescriptionData ? newPillList : existingPillList;

    return (
        <View style={{ backgroundColor: theme.colors.accent }} className="flex-1 px-6 pt-8">
            {/* Header */}
            <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={() => {
                    if (prescriptionData) {
                        // truong hop addPrescription
                        if (newPillList.length > 0) {
                            setWarningModalVisible(true);
                        } else {
                            router.replace('/homePage');
                        }
                    } else if (existingPillList.length > 0) {
                        // truong hop updatePrescription
                        setWarningModalVisible(true);
                    } else {
                        router.replace('/homePage');
                    }
                }}>
                    <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>

                <Text
                    style={{ fontSize: hp(2.5) }}
                    className="text-center font-semibold ml-2">
                    {prescriptionData ? "Add Prescription Pills" : "Update Prescription Pills"}
                </Text>
            </View>

            {/* Illustration */}
            <View className='flex-row mt-14 ml-2'>
                <Image source={images.pill2} className="w-12 h-12 self-start mb-4" />
                <Image source={images.injection} className="w-12 h-12 self-start mb-4" />
            </View>

            {/* Title */}
            <Text style={{ fontSize: hp(3) }} className="font-semibold ml-2 mb-5">
                {prescriptionData ? "Add new pills" : "Manage existing pills"}
            </Text>

            {/* Pill List */}
            <View
                style={{ maxHeight: hp(55) }}
                className="bg-white rounded-2xl overflow-hidden mb-6"
            >
                <FlatList
                    data={currentPillList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingVertical: 16 }}
                />
            </View>
            <Text
                style={{ fontSize: hp(1.5) }}
                className="italic text-base text-left ml-1"
            >
                Note: Please press pill to delete.
            </Text>
            {/* Bottom Buttons */}
            <View className="flex-row justify-end items-center">
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    className="flex bg-orange-400 rounded-full w-12 h-12 justify-center items-center shadow-3xl"
                >
                    <Text style={{ fontSize: hp(3.5) }} className="text-white">+</Text>
                </TouchableOpacity>

                {isLoading ?
                    <View className='px-5 ml-5'>
                        <Loading size={hp(6)} />
                    </ View>
                    :
                    <TouchableOpacity style={{ backgroundColor: theme.colors.primary }} className="px-6 py-3 rounded-full ml-5 shadow-xl">
                        <Text
                            onPress={handleConfirm}
                            className="text-white font-semibold text-base">Confirm</Text>
                    </TouchableOpacity>
                }
            </View>

            {/* Delete Confirmation Modal */}
            <ReactNativeModal isVisible={isAlertVisible}>
                <CustomAlert
                    title="Delete Pill"
                    message="Do you want to delete this pill?"
                    btnConfirm="Delete"
                    confirmTextColor="text-red-500"
                    onCancel={() => setIsAlertVisible(false)}
                    onConfirm={() => deletePill(pillId)}
                />
            </ReactNativeModal>

            {/* Add Confirmation Modal */}
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
                        <Text className="text-white text-2xl font-bold text-center">
                            {prescriptionData ? "Add New Pill" : "Update Pill"}
                        </Text>
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

            {/* Success/Error Message Modal */}
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

            {/* Exit Warning Modal */}
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
                        Are you sure you want to exit? Your unsaved changes will be lost.
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
