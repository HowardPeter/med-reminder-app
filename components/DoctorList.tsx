import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import DoctorCard from './DoctorCard';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  gender: string;
}

interface Props {
  onEditDoctor?: (id: string) => void;
}

const DoctorList = ({ onEditDoctor }: Props) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      const list: Doctor[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name,
          specialty: data.specialty || 'No specialty listed',
          gender: data.gender || 'male',
        });
      });
      setDoctors(list);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'You are sure to delete this doctor',
      'Are you sure you want to delete this doctor?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(id),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'doctors', id));
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError('Failed to delete doctor. Please try again.');
    }
  };

  const handleEdit = (id: string) => {
    if (onEditDoctor) {
      onEditDoctor(id);
    } else {
      router.push({ pathname: '/updateDoctor', params: { id } });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, backgroundColor: '#ffffff' }}>
      {/* Header - chỉ hiện nếu có bác sĩ */}
      {doctors.length > 0 && (
        <View className="mb-8">
          <Text style={{ fontSize: 32, fontWeight: '600', color: '#0f766e' }}>
            Consulting Doctors
          </Text>
          <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 8 }}>
            View and manage your consulting doctors easily
          </Text>
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
        </View>
      )}

      {/* Empty List Message */}
      {doctors.length === 0 ? (
        <View style={{ alignItems: 'center', marginVertical: 24 }}>
          <Image
            source={require('@/assets/images/list-your-doctors.png')}
            style={{ width: 190, height: 190 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 16, color: '#0f766e' }}>
            List your doctors
            </Text>

            <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 8, fontSize: 16 }}>
                 You currently do not have any doctors. Please add more doctors for easy contact.
            </Text>

        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEdit(item.id)}>
              <DoctorCard
                name={item.name}
                specialty={item.specialty}
                gender={item.gender}
                onDelete={() => confirmDelete(item.id)}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default DoctorList;
