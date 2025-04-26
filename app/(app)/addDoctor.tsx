import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import theme from '@/config/theme';
import DoctorForm from '@/components/DoctorForm';
import { useAuth } from '@/hooks/useAuth';

export default function AddDoctorScreen() {
  const router = useRouter();

  const [focusedInput, setFocusedInput] = useState('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const { user } = useAuth();
  const userId = user?.userId ?? null;

  const handleDone = async () => {
    if (!name || !specialty || !phone) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    
    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const newDoctor = {
      name,
      specialty,
      phone,
      email,
      address,
      gender: selectedGender,
      userId,
    };

    try {
      await addDoc(collection(db, 'doctors'), newDoctor);
      Alert.alert('Success', 'Doctor added successfully!');
      router.push('/consultingDoctors');
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

      <DoctorForm
        name={name} setName={setName}
        specialty={specialty} setSpecialty={setSpecialty}
        phone={phone} setPhone={setPhone}
        email={email} setEmail={setEmail}
        address={address} setAddress={setAddress}
        selectedGender={selectedGender} setSelectedGender={setSelectedGender}
        focusedInput={focusedInput} setFocusedInput={setFocusedInput}
        onSubmit={handleDone}
      />

    </View>
  );
}
