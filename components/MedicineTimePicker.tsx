import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
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
          conflictingTime: times[i]
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
    // Time is already in 24-hour format from the TimePicker
    const formattedTime = time.split(':').slice(0, 2).join(':'); // Remove seconds if present
    
    // Check for time interval validation
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
      
      // Sort times chronologically
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
      seconds: 0
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.timesContainer}>
        {times.map((time, index) => (
          <TouchableOpacity 
            key={`${time}-${index}`}
            style={styles.timeButton}
            onPress={() => handleTimePress(time, index)}
            onLongPress={() => handleTimeLongPress(index)}
          >
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddTime}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.note}>Note: Times must be at least 1 hour apart</Text>
      
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 370,
    maxWidth: 400,
    alignItems: 'center',
    // borderColor: '#949494',
    // borderWidth: 1,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 20,
    margin: 5,
  },
  timeText: {
    fontSize: 16,
    color: '#00796b',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FF9D23',
    borderRadius: 20,
    margin: 5,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    // width: '80%',
  },
});

export default MedicineTimePicker;