import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/constants';

interface DoctorCardProps {
  name: string;
  specialty: string;
  gender: string;
  onDelete: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ name, specialty, gender, onDelete }) => {
  return (
    <View
      style={{
        backgroundColor: '#C7E5E1',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
            borderWidth: 2,
            borderColor: '#4CA89A',
          }}
        >
          <Image
            source={gender === 'female' ? images.doctorNu : images.doctorNam}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </View>

        <View>
          {/* Name */}
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{name}</Text>
          {/* Specialty */}
          <Text style={{ color: '#555', fontSize: 14, marginTop: 4 }}>
            {specialty || 'No specialty listed'}
          </Text>
        </View>
      </View>

      {/* btn Delete */}
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export default DoctorCard;
