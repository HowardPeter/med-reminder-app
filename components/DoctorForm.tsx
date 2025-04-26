import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { images } from '@/constants';

interface DoctorFormProps {
    readonly name: string;
    readonly setName: (value: string) => void;
    readonly specialty: string;
    readonly setSpecialty: (value: string) => void;
    readonly phone: string;
    readonly setPhone: (value: string) => void;
    readonly email: string;
    readonly setEmail: (value: string) => void;
    readonly address: string;
    readonly setAddress: (value: string) => void;
    readonly selectedGender: 'male' | 'female';
    readonly setSelectedGender: (value: 'male' | 'female') => void;
    readonly focusedInput: string;
    readonly setFocusedInput: (value: string) => void;
    readonly onSubmit: () => void;
}

export default function DoctorForm({
    name, setName,
    specialty, setSpecialty,
    phone, setPhone,
    email, setEmail,
    address, setAddress,
    selectedGender, setSelectedGender,
    focusedInput, setFocusedInput,
    onSubmit,
}: DoctorFormProps) {
    const getBorderColor = (inputName: string): string => focusedInput === inputName ? '#4CA89A' : '#ccc';

    return (
        <View className="p-6">
            {/* Avatar + Name */}
            <View className="flex-row items-center mb-4">
                <View className="w-16 h-16 rounded-full border-2 border-teal-500 overflow-hidden mr-2">
                    <Image
                        source={selectedGender === 'male' ? images.doctorNam : images.doctorNu}
                        className="w-full h-full"
                    />
                </View>
                <View
                    style={{ borderBottomColor: getBorderColor('name'), borderBottomWidth: 1 }}
                    className="flex-1"
                >
                    <TextInput
                        placeholder="Doctor’s Name"
                        placeholderTextColor="#999"
                        className="text-base text-gray-800 pb-1"
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput('')}
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <MaterialIcons name="badge" size={22} color="#4CA89A" className="ml-2" />
            </View>

            {/* Gender */}
            <View className="flex-row items-center mb-4 mt-2">
                {['male', 'female'].map((gender) => (
                    <TouchableOpacity
                        key={gender}
                        onPress={() => setSelectedGender(gender)}
                        className="flex-row items-center mr-4"
                    >
                        <Text className="text-gray-800 capitalize">{gender}</Text>
                        {selectedGender === gender && (
                            <MaterialIcons name="check-circle" size={22} color="#4CA89A" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Specialty */}
            <View
                style={{ borderBottomColor: getBorderColor('specialty'), borderBottomWidth: 1, width: '92%' }}
                className="mb-4"
            >
                <TextInput
                    placeholder="Specialty"
                    placeholderTextColor="#999"
                    className="text-base text-gray-800 pb-1"
                    onFocus={() => setFocusedInput('specialty')}
                    onBlur={() => setFocusedInput('')}
                    value={specialty}
                    onChangeText={setSpecialty}
                />
            </View>

            {/* Phone */}
            <View
                style={{ borderBottomColor: getBorderColor('phone'), borderBottomWidth: 1 }}
                className="flex-row items-center mb-4 pb-2"
            >
                <Feather name="phone" size={20} color="#4CA89A" />
                <TextInput
                    placeholder="Phone number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    className="ml-3 flex-1 text-base text-gray-800"
                    onFocus={() => setFocusedInput('phone')}
                    onBlur={() => setFocusedInput('')}
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>

            {/* Email */}
            <View
                style={{ borderBottomColor: getBorderColor('email'), borderBottomWidth: 1 }}
                className="flex-row items-center mb-4 pb-2"
            >
                <Feather name="mail" size={20} color="#4CA89A" />
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    className="ml-3 flex-1 text-base text-gray-800"
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput('')}
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            {/* Address */}
            <View
                style={{ borderBottomColor: getBorderColor('address'), borderBottomWidth: 1 }}
                className="flex-row items-center mb-4 pb-2"
            >
                <Feather name="map-pin" size={20} color="#4CA89A" />
                <TextInput
                    placeholder="Address"
                    placeholderTextColor="#999"
                    className="ml-3 flex-1 text-base text-gray-800"
                    onFocus={() => setFocusedInput('address')}
                    onBlur={() => setFocusedInput('')}
                    value={address}
                    onChangeText={setAddress}
                />
            </View>

            {/* Done */}
            <TouchableOpacity
                className="bg-teal-600 rounded-2xl mt-6 py-3 items-center"
                onPress={onSubmit}
            >
                <Text className="text-white font-bold text-base">DONE</Text>
            </TouchableOpacity>
        </View>
    );
}
