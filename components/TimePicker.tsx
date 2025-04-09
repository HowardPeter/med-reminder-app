import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TimePickerProps {
  onSave?: (time: string) => void;
  onCancel?: () => void;
  initialTime?: { hours: number; minutes: number; seconds: number };
}

const TimePicker: React.FC<TimePickerProps> = ({
  onSave,
  onCancel,
  initialTime = { hours: 18, minutes: 27, seconds: 54 }, // Using 24-hour format
}) => {
  const [time, setTime] = useState(initialTime);

  const increment = (type: 'hours' | 'minutes' | 'seconds') => {
    setTime(prev => {
      let newValue = prev[type] + 1;
      if (type === 'hours' && newValue > 23) newValue = 0;
      if (type !== 'hours' && newValue > 59) newValue = 0;
      return { ...prev, [type]: newValue };
    });
  };

  const decrement = (type: 'hours' | 'minutes' | 'seconds') => {
    setTime(prev => {
      let newValue = prev[type] - 1;
      if (type === 'hours' && newValue < 0) newValue = 23;
      if (type !== 'hours' && newValue < 0) newValue = 59;
      return { ...prev, [type]: newValue };
    });
  };

  const handleSave = () => {
    if (onSave) {
      const formattedTime = `${time.hours.toString().padStart(2, '0')}:${time.minutes
        .toString()
        .padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
      onSave(formattedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set time (24-hour format)</Text>
      
      <View style={styles.timeDisplayContainer}>
        <TimeUnit 
          value={time.hours} 
          onIncrement={() => increment('hours')} 
          onDecrement={() => decrement('hours')} 
        />
        <Text style={styles.colon}>:</Text>
        <TimeUnit 
          value={time.minutes} 
          onIncrement={() => increment('minutes')} 
          onDecrement={() => decrement('minutes')} 
        />
        <Text style={styles.colon}>:</Text>
        <TimeUnit 
          value={time.seconds} 
          onIncrement={() => increment('seconds')} 
          onDecrement={() => decrement('seconds')} 
        />
      </View>
      
      <View style={styles.timeDisplay}>
        <Text style={styles.timeText}>
          {time.hours.toString().padStart(2, '0')} : {time.minutes.toString().padStart(2, '0')} : {time.seconds.toString().padStart(2, '0')}
        </Text>
      </View>
      
      <View style={styles.timeDisplay}>
        <Text style={styles.timeText}>
          {time.hours.toString().padStart(2, '0')}   {time.minutes.toString().padStart(2, '0')}   {time.seconds.toString().padStart(2, '0')}
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface TimeUnitProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, onIncrement, onDecrement }) => {
  return (
    <View style={styles.timeUnitContainer}>
      <TouchableOpacity onPress={onIncrement} style={styles.arrowButton}>
        <Text style={styles.arrow}>↑</Text>
      </TouchableOpacity>
      <Text style={styles.timeUnitText}>{value.toString().padStart(2, '0')}</Text>
      <TouchableOpacity onPress={onDecrement} style={styles.arrowButton}>
        <Text style={styles.arrow}>↓</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timeDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeUnitContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  timeUnitText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  colon: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  arrowButton: {
    padding: 5,
  },
  arrow: {
    fontSize: 16,
  },
  timeDisplay: {
    marginVertical: 5,
  },
  timeText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TimePicker;