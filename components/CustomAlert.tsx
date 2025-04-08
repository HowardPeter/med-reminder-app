import { View, Text, TouchableOpacity } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import React from 'react'
import theme from '@/config/theme';
import Thinking from './thinking'

type CustomAlertProps = Readonly<{
    title: string;
    message: string;
    btnConfirm: string;
    confirmTextColor: string;
    onConfirm: () => void;
    onCancel?: () => void;
}>;

export default function CustomAlert({ title, message, btnConfirm, confirmTextColor, onConfirm, onCancel }: CustomAlertProps) {
    return (
        <View className='flex-1 justify-center items-center'>
            <View style={{ backgroundColor: theme.colors.secondary, maxWidth: 300 }} className='flex p-5 rounded-2xl'>
                <View className='flex-row justify-center'>
                    <Thinking size={hp(11)} />
                </View>
                <Text style={{ fontSize: hp(2.9) }} className='font-semibold text-center my-2'>{title}</Text>
                <Text style={{ fontSize: hp(2.1) }} className='text-lg my-1'>{message}</Text>
                <View className='flex-row justify-end my-6 mr-2'>
                    <TouchableOpacity onPress={onCancel} className='mr-9'>
                        <Text className='text-white text-xl font-bold'>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm}>
                        <Text className={`${confirmTextColor} text-xl font-bold`}>{btnConfirm}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}