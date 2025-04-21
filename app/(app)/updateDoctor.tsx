import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import theme from '@/config/theme';
import DoctorForm from '@/components/DoctorForm';

export default function UpdateDoctorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [focusedInput, setFocusedInput] = useState('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

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

      <DoctorForm
        name={name} setName={setName}
        specialty={specialty} setSpecialty={setSpecialty}
        phone={phone} setPhone={setPhone}
        email={email} setEmail={setEmail}
        address={address} setAddress={setAddress}
        selectedGender={selectedGender} setSelectedGender={setSelectedGender}
        focusedInput={focusedInput} setFocusedInput={setFocusedInput}
        onSubmit={handleUpdate}
      />

    </View>
  );
}
