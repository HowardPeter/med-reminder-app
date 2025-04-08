import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import TimePicker from './TimePicker';

interface MedicineTimePickerProps {
  initialTimes?: string[];
  onTimesChange?: (times: string[]) => void;
}

const MedicineTimePicker: React.FC<MedicineTimePickerProps> = ({
  initialTimes = ['07:30', '19:30'],
  onTimesChange,
}) => {
  const [times, setTimes] = useState<string[]>(initialTimes);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDeviceTime, setCurrentDeviceTime] = useState('');

  useEffect(() => {
    updateCurrentDeviceTime();
  }, []);

  const updateCurrentDeviceTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentDeviceTime(`${hours}:${minutes}`);
  };

  const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const validateTimeInterval = (newTime: string, currentIndex: number | null) => {
    const newTimeMinutes = timeToMinutes(newTime);

    for (let i = 0; i < times.length; i++) {
      if (currentIndex !== null && i === currentIndex) continue;

      const existingTimeMinutes = timeToMinutes(times[i]);
      const timeDiff = Math.abs(newTimeMinutes - existingTimeMinutes);

      if (timeDiff > 0 && timeDiff < 60) {
        return {
          valid: false,
          conflictingTime: times[i],
        };
      }
    }

    return { valid: true };
  };

  const handleTimePress = (time: string, index: number) => {
    setCurrentTime(time);
    setEditingIndex(index);
    setShowTimePicker(true);
  };

  const handleTimeLongPress = (index: number) => {
    Alert.alert(
      'Delete Time',
      'Are you sure you want to delete this time?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteTime(index) },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteTime = (index: number) => {
    setTimes(prev => {
      const newTimes = [...prev];
      newTimes.splice(index, 1);
      if (onTimesChange) onTimesChange(newTimes);
      return newTimes;
    });
  };

  const handleAddTime = () => {
    updateCurrentDeviceTime();
    setCurrentTime(currentDeviceTime);
    setEditingIndex(null);
    setShowTimePicker(true);
  };

  const handleSaveTime = (time: string) => {
    const formattedTime = time.split(':').slice(0, 2).join(':');

    const validation = validateTimeInterval(formattedTime, editingIndex);
    if (!validation.valid) {
      Alert.alert(
        'Invalid Time Interval',
        `Times must be at least 1 hour apart. This conflicts with ${validation.conflictingTime}.`,
        [{ text: 'OK' }]
      );
      return;
    }

    setTimes(prev => {
      let newTimes;
      if (editingIndex !== null) {
        newTimes = [...prev];
        newTimes[editingIndex] = formattedTime;
      } else {
        newTimes = [...prev, formattedTime];
      }

      newTimes.sort((a, b) => timeToMinutes(a) - timeToMinutes(b));

      if (onTimesChange) onTimesChange(newTimes);
      return newTimes;
    });

    setShowTimePicker(false);
  };

  const handleCancelTimePicker = () => {
    setShowTimePicker(false);
  };

  const parseTimeForPicker = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return {
      hours,
      minutes,
      seconds: 0,
    };
  };

  return (
    <View className="rounded-xl w-[370px] max-w-[400px] items-center">
      <View className="flex-row flex-wrap justify-between mb-2 w-full">
        <View className='w-[88%] flex-row'>
          {times.map((time, index) => (
            <TouchableOpacity
              key={`${time}-${index}`}
              className="py-2 px-4 bg-cyan-100 rounded-full m-1"
              onPress={() => handleTimePress(time, index)}
              onLongPress={() => handleTimeLongPress(index)}
            >
              <Text className="text-teal-800 text-base">{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="py-2 px-4 bg-[#FF9D23] rounded-full m-1"
          onPress={handleAddTime}>
          <Text className="text-white text-base font-bold">+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View>
            <TimePicker
              onSave={handleSaveTime}
              onCancel={handleCancelTimePicker}
              initialTime={currentTime ? parseTimeForPicker(currentTime) : parseTimeForPicker(currentDeviceTime)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MedicineTimePicker;