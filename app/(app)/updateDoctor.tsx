import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { db } from '@/firebaseConfig'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import theme from '@/config/theme';

export default function UpdateDoctorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const [focusedInput, setFocusedInput] = useState('');
  const [selectedGender, setSelectedGender] = useState('male');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  
  const getBorderColor = (inputName: string) =>
    focusedInput === inputName ? '#4CA89A' : '#ccc';

  
  const handleGenderSelection = (gender: string) => {
    setSelectedGender(gender);
  };

  const loadDoctor = async () => {
    try {
      const docRef = doc(db, 'doctors', id as string); 
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const doctor = docSnap.data();
        setName(doctor.name);
        setSpecialty(doctor.specialty);
        setPhone(doctor.phone);
        setEmail(doctor.email);
        setAddress(doctor.address);
        setSelectedGender(doctor.gender || 'male'); 
      } else {
        Alert.alert('Error', 'Doctor not found!');
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not load doctor data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadDoctor(); 
    }
  }, [id]);

  // Hàm xử lý cập nhật thông tin doctor
  const handleUpdate = async () => {
    if (!name || !specialty || !phone || !email || !address) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    const updatedDoctor = {
      name,
      specialty,
      phone,
      email,
      address,
      gender: selectedGender, 
    };

    try {
      const docRef = doc(db, 'doctors', id as string);
      await updateDoc(docRef, updatedDoctor); 
      Alert.alert('Success', 'Doctor updated successfully!');
      router.push('/consultingDoctors');
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Error', 'Could not update doctor. Try again.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4CA89A" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
         {/* Header */}
         <View style={{ backgroundColor: theme.colors.primary }} className="flex-row py-5 px-3">
            <TouchableOpacity onPress={() => router.back()}>
                <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
                <View className='flex-1'>
                    <Text className="text-2xl font-bold text-white text-center">Contact Detail</Text>
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

        {/* Text - Phone */}
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

        {/* Text - Email */}
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

        {/* Text - Address */}
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

        {/* Btn Update */}
        <TouchableOpacity
          className="bg-teal-600 rounded-2xl mt-6 py-3 items-center"
          onPress={handleUpdate}
        >
          <Text className="text-white font-bold text-base">UPDATE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
