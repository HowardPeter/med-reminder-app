import React from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import PrescriptionAccordion from '@/components/PrescriptionAccordion';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import theme from '@/config/theme';

const data = [
    {
        name: 'Prescription for stomachache',
        time: '7:30, 19:30',
        note: 'After breakfast',
        pills: [
            { name: 'Penicilin', type: 'Pill', dosage: 1 },
            { name: 'Asthma Inhaler', type: 'Inhaler', dosage: 1 },
        ],
    },
    {
        name: 'Doses for the flu',
        time: '18:00',
        note: 'After dinner, wait for 10 mins',
        pills: [],
    },
];

export default function ActivePrescriptions() {

    return (
        <View style={{ backgroundColor: theme.colors.background }} className="flex-1">
            <View style={{ backgroundColor: theme.colors.primary }} className="p-5 rounded-b-3xl">
                <Text className="text-white text-2xl font-bold">Active prescriptions</Text>
            </View>

            <View className="flex-1 bg-[#B7DCD3] pt-4">
                <FlatList
                    data={data}
                    keyExtractor={() => Math.random().toString()}
                    renderItem={({ item }) => (
                        <PrescriptionAccordion
                            name={item.name}
                            time={item.time}
                            note={item.note}
                            pills={item.pills}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>


            {/* Floating Add Button */}
            <TouchableOpacity className="absolute bottom-20 right-5 bg-white w-12 h-12 rounded-full items-center justify-center shadow-lg">
                <Text className="text-orange-500 text-3xl">+</Text>
            </TouchableOpacity>

            {/* Bottom Navigation Bar */}
            <View
                style={{ backgroundColor: theme.colors.primary }}
                className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center h-16 rounded-t-3xl"
            >
                <TouchableOpacity onPress={() => router.push('/homePage')}>
                    <FontAwesome name="home" size={35} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="pill" size={35} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/userSettings")}>
                    <FontAwesome name="user" size={35} color="gray" />
                </TouchableOpacity>
            </View>
        </View>
    );
};