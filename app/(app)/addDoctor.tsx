import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { db } from '@/firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';
import theme from '@/config/theme';

export default function AddDoctorScreen() {
  const router = useRouter();

  const [focusedInput, setFocusedInput] = useState('');
  const [selectedGender, setSelectedGender] = useState('male');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');  
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const getBorderColor = (inputName) =>
    focusedInput === inputName ? '#4CA89A' : '#ccc';

  const handleGenderSelection = (gender) => {
    setSelectedGender(gender);
  };

  const handleDone = async () => {
    if (!name || !specialty || !phone) { 
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    const newDoctor = {
      name,
      specialty,  
      phone,
      email,
      address,
      gender: selectedGender
    };

    try {
      await addDoc(collection(db, 'doctors'), newDoctor);
      Alert.alert('Success', 'Doctor added successfully!');
      router.replace('/consultingDoctors');
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      Alert.alert('Error', 'Could not save doctor. Try again.');
    }
  };

  return (
    <View className="flex-1 bg-white">
        <View style={{ backgroundColor: theme.colors.primary }} className="flex-row py-5 px-3">
            <TouchableOpacity onPress={() => router.back()}>
             <MaterialIcons name="close" size={24} color="white" />
             </TouchableOpacity>
        <View className='flex-1'>
    <Text className="text-2xl font-bold text-white text-center">Add Doctor</Text>
        </View>
    </View>

      <View className="p-6">
        <View className="flex-row items-center mb-4">
          <View className="w-16 h-16 rounded-full border-2 border-teal-500 overflow-hidden mr-2">
            <Image
              source={
                selectedGender === 'male'
                  ? require('@/assets/images/doctor-nam.png')
                  : require('@/assets/images/doctor-nu.png')
              }
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
          <TouchableOpacity onPress={() => handleGenderSelection('male')} className="flex-row items-center mr-4">
            <Text className="text-gray-800">Male</Text>
            {selectedGender === 'male' && (
              <MaterialIcons name="check-circle" size={22} color="#4CA89A" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleGenderSelection('female')} className="ml-4 flex-row items-center">
            <Text className="text-gray-800">Female</Text>
            {selectedGender === 'female' && (
              <MaterialIcons name="check-circle" size={22} color="#4CA89A" />
            )}
          </TouchableOpacity>
        </View>

        {/* Specialty */}
        <View
          style={{
            borderBottomColor: getBorderColor('specialty'),
            borderBottomWidth: 1,
            width: '92%'  
          }}
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

        {/* Btn done */}
        <TouchableOpacity 
          className="bg-teal-600 rounded-2xl mt-6 py-3 items-center"
          onPress={handleDone}
        >
          <Text className="text-white font-bold text-base">DONE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
