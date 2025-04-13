import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';

type ModalType = 'Success' | 'Error';

interface MessageModalProps {
    visible: boolean;
    onClose: () => void;
    message: string;
    type: ModalType;
}

const modalConfigs = {
    Success: {
        icon: 'check-circle' as keyof typeof Feather.glyphMap,
        color: 'bg-teal-500',
        title: 'Success',
        buttonText: 'Great!',
    },
    Error: {
        icon: 'alert-circle' as keyof typeof Feather.glyphMap,
        color: 'bg-red-500',
        title: 'Error',
        buttonText: 'Try Again',
    },
};

const MessageModal: React.FC<MessageModalProps> = ({ visible, onClose, message, type }) => {
    const { icon, color, title, buttonText } = modalConfigs[type];

    return (
        <ReactNativeModal
            isVisible={visible}
            onBackdropPress={onClose}
            backdropOpacity={0.7}
            animationIn="zoomIn"
            animationOut="zoomOut"
            style={{ justifyContent: 'center', alignItems: 'center' }}
        >
            <View className="bg-white rounded-2xl w-[90%] pt-16 pb-6 px-6 items-center relative">
                <View className={`absolute -top-12 ${color} h-24 w-24 rounded-full items-center justify-center shadow-lg`}>
                    <Feather name={icon} size={50} color="white" />
                </View>

                <Text className="text-xl font-bold text-center text-gray-800 mb-2">{title}</Text>
                <Text className="text-center text-base text-gray-600">{message}</Text>

                <View className="w-full mt-6">
                    <TouchableOpacity
                        onPress={onClose}
                        className={`${color} py-3 rounded-2xl items-center`}
                    >
                        <Text className="text-white text-lg font-bold">{buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ReactNativeModal>
    );
};

export default MessageModal;
