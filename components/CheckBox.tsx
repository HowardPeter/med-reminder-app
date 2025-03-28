import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CheckBoxProps {
    isChecked: boolean;
    onToggle: () => void;
    size: number;
    color: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({ isChecked, onToggle, size, color }) => {
    return (
        <View>
            <TouchableOpacity onPress={onToggle}>
                {
                    isChecked ?
                        <Ionicons name="checkbox" size={size} color={color} /> :
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={size} color={color} />
                }
            </TouchableOpacity>
        </View>
    )
}

export default CheckBox;