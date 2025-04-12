import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface Pill {
    name: string;
    type: string;
    dosage: number;
}

interface Props {
    name: string;
    time: string;
    note: string;
    pills: Pill[];
}

const PrescriptionAccordion: React.FC<Props> = ({ name, time, note, pills }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View className="bg-white rounded-xl p-4 mb-4 mx-4 shadow-md">
            <TouchableOpacity onPress={() => setExpanded(!expanded)} className="flex-row justify-between items-center mb-2">
                <View>
                    <Text className="font-bold text-base">{name}</Text>
                    <Text className="text-sm text-gray-700">Everyday {time}</Text>
                    <Text className="text-sm text-gray-500">{note}</Text>
                </View>
                <Entypo name={expanded ? 'chevron-with-circle-up' : 'chevron-with-circle-down'} size={24} className='mr-1' />
            </TouchableOpacity>

            {expanded && (
                <View className="border-t border-gray-300 mt-2 pt-2">
                    {pills.map((pill, index) => (
                        <View key={index} className="flex-row justify-between py-2 border-b border-gray-200">
                            <View>
                                <Text className="font-semibold">{pill.name}</Text>
                                <Text className="text-xs text-gray-500">{pill.type}</Text>
                            </View>
                            <Text className="text-sm font-medium">Dosage: {pill.dosage}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default PrescriptionAccordion;