import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Fontisto } from '@expo/vector-icons';

interface DatePickerFieldProps {
  initialDate?: string;
  onDateChange: (formattedDate: string, dateObject: Date) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  initialDate,
  onDateChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState(initialDate || '');

  useEffect(() => {
    if (initialDate) {
      setStartDate(initialDate);
      const [day, month, year] = initialDate.split('/');
      const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      setDate(parsedDate);
    }
  }, [initialDate]);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }: any, selectedDate?: Date) => {
    if (type === 'set' && selectedDate) {
      const formatted = formatDate(selectedDate);
      setStartDate(formatted);
      setDate(selectedDate);
      onDateChange(formatted, selectedDate);
    }
    setShowPicker(false);
  };

  return (
    <View>
      <Pressable onPress={toggleDatePicker}>
        <View className="bg-white flex-row items-center border border-gray-400 rounded-[10px] h-[50px] w-[370px] mt-2 px-4">
          <Fontisto name="date" size={24} color="black" />
          <Text
            className="px-3 pr-3 text-1xl w-full"
            style={{ color: startDate ? '#000000' : '#A9A9A9' }}
          >
            {startDate || 'Select a date'}
          </Text>
        </View>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DatePickerField;
