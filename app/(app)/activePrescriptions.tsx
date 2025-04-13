import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import PrescriptionAccordion from '@/components/PrescriptionAccordion';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import theme from '@/config/theme';
import { useCrud } from '@/hooks/useCrud';
import { useAuth } from '@/hooks/useAuth';

export default function ActivePrescriptions() {
    const { user } = useAuth();
    const { fetchPrescriptionData, fetchPillsData } = useCrud();
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const userId = user?.userId ?? '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prescriptions = await fetchPrescriptionData(userId);

                // Fetch pills for each prescription
                const prescriptionsWithPills = await Promise.all(
                    prescriptions.map(async (prescription: any) => {
                        const pills = await fetchPillsData(prescription.id);
                        return { ...prescription, pills };
                    })
                );

                setPrescriptions(prescriptionsWithPills);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <View style={{ backgroundColor: theme.colors.background }} className="flex-1">
            <View style={{ backgroundColor: theme.colors.primary }} className="p-5 rounded-b-3xl">
                <Text className="text-white text-2xl font-bold">Active prescriptions</Text>
            </View>

            <View className="flex-1 pt-4">
                <FlatList
                    data={prescriptions}
                    keyExtractor={() => Math.random().toString()}
                    renderItem={({ item }) => (
                        <PrescriptionAccordion
                            name={item?.name}
                            time={item?.time.join(', ')}
                            frequency={item?.frequency}
                            note={item?.note}
                            pills={item.pills ?? []}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 70 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>


            {/* Floating Action Button */}
                  <TouchableOpacity
                    onPress={() => router.push('/addPrescription')}
                    style={{ width: hp(7), height: hp(7) }}
                    className="absolute bottom-20 right-5 bg-orange-500 rounded-full items-center justify-center shadow-strong"
                  >
                    <Text style={{ fontSize: hp(4) }} className="text-white">+</Text>
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