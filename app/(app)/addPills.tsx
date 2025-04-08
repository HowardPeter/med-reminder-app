import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { images } from '@/constants';
import { router } from 'expo-router';
import theme from '@/config/theme';
import PillCard from '@/components/PillCard';

const pills = [
    { id: '1', name: 'Penicilin', type: 'Pill', dosage: '1', icon: images.pill },
    { id: '2', name: 'Asthma Inhaler', type: 'Inhaler', dosage: '2', icon: images.pill },
    { id: '3', name: 'Penicilin2', type: 'Pill', dosage: '1', icon: images.pill },
    { id: '4', name: 'Penicilin3', type: 'Pill', dosage: '3', icon: images.pill },
    { id: '5', name: 'Penicilin4', type: 'Pill', dosage: '3', icon: images.pill },
    { id: '6', name: 'Penicilin5', type: 'Pill', dosage: '3', icon: images.pill },
    { id: '7', name: 'Penicilin6', type: 'Pill', dosage: '3', icon: images.pill },
    { id: '8', name: 'Penicilin7', type: 'Pill', dosage: '3', icon: images.pill },
    { id: '9', name: 'Penicilin8', type: 'Pill', dosage: '3', icon: images.pill },
    { id: '10', name: 'Penicilin9', type: 'Pill', dosage: '3', icon: images.pill },
    { id: '11', name: 'Penicilin10', type: 'Pill', dosage: '3', icon: images.pill },
];

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

    return (
        <View style={{ backgroundColor: theme.colors.accent }} className="flex-1 px-6 pt-8">
            {/* Header */}
            <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: hp(2.5) }} className="text-center font-semibold ml-2">Prescription for headache</Text>
            </View>

            {/* Illustration */}
            <View className='flex-row mt-14 ml-2'>
                <Image source={images.pill2} className="w-12 h-12 self-start mb-4" />
                <Image source={images.injection} className="w-12 h-12 self-start mb-4" />
            </View>

            {/* Title */}
            <Text style={{ fontSize: hp(3) }} className="font-semibold ml-2 mb-5">Add pills to your{'\n'}prescription</Text>

            {/* Pill List */}
            <View style={{maxHeight: hp(55)}} className="bg-white rounded-2xl overflow-hidden mb-6">
                <FlatList
                    data={pills}
                    renderItem={renderItem}
                    keyExtractor={() => Math.random().toString()}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingVertical: 16 }}
                />
            </View>

            {/* Bottom Buttons */}
            <View className="flex-row justify-end items-center">
                <TouchableOpacity className="flex bg-orange-400 rounded-full w-12 h-12 justify-center items-center shadow-3xl">
                    <Text style={{ fontSize: hp(3.5) }} className="text-white">+</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{backgroundColor: theme.colors.primary}} className="px-6 py-3 rounded-full ml-5 shadow-xl">
                    <Text className="text-white font-semibold text-base">Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddPills;