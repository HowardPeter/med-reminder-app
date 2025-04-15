import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import DoctorList from '@/components/DoctorList';

export default function ConsultingDoctors() {
  const router = useRouter();

  const handleEditDoctor = (doctorId: string) => {
    router.push({ pathname: '/updateDoctor', params: { id: doctorId } });
  };

  return (
    <View className="flex-1 bg-white pt-12 px-6">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.replace('/userSettings')}>
          <Ionicons name="arrow-back" size={28} color="#0f766e" />
        </TouchableOpacity>
      </View>

      
      <View className="flex-1">
        <DoctorList onEditDoctor={handleEditDoctor} />
      </View>

      {/* Nút Thêm */}
      <View className="absolute bottom-10 right-5">
        <TouchableOpacity
          onPress={() => router.push('/addDoctor')}
          className="bg-teal-600 p-6 rounded-full shadow-xl justify-center items-center">
          <Text className="text-white text-1xl font-bold">+ Add Doctor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
