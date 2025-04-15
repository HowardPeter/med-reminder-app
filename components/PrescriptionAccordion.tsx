import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Entypo } from '@expo/vector-icons';

interface Pill {
    id: string;
    name: string;
    type: string;
    dosage: number;
}

interface Props {
    name: string;
    time: string;
    frequency: number;
    note: string;
    pills: Pill[];
}

const PrescriptionAccordion: React.FC<Props> = ({ name, time, frequency, note, pills }) => {
    const [expanded, setExpanded] = useState(false);

    const frequencyConvert = (frequency: number) => {
        switch (frequency) {
            case 0:
                return 'No repeat';
            case 1:
                return 'Everyday';
            case 7:
                return 'Weekly';
            default:
                return 'Unknown frequency';
        }
    }

    return (
        <View className="bg-white rounded-xl p-4 mb-4 mx-3 shadow-xl">
            <TouchableOpacity onPress={() => setExpanded(!expanded)} className="flex-row justify-between items-center mb-2">
                <View>
                    <Text style={{fontSize: hp(2.1)}} className="text-xl font-bold">{name}</Text>
                    <Text style={{fontSize: hp(1.68)}} className="text-base font-semibold text-gray-600">{frequencyConvert(frequency)}: {time}</Text>
                    <Text style={{fontSize: hp(1.65)}} className="text-base text-gray-500">{note}</Text>
                </View>
                <Entypo name={expanded ? 'chevron-with-circle-up' : 'chevron-with-circle-down'} size={24} className='mr-1' />
            </TouchableOpacity>

            {expanded && (
                <View className="border-t border-gray-300 mt-2">
                    {pills.map((pill, index) => (
                        <View key={pill?.id ?? pill.name} className="flex-row justify-between py-2 border-b border-gray-200">
                            <View>
                                <Text className="text-base font-semibold">{pill.name}</Text>
                                <Text className="text-sm text-gray-500">{pill.type}</Text>
                            </View>
                            <Text className="text-sm font-semibold">
                                Dosage: <Text className='font-bold'>{pill.dosage}</Text>
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default PrescriptionAccordion;