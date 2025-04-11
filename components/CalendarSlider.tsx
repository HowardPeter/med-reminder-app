import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type CalendarSliderProps = Readonly<{
    selectedDate: Date,
    onSelectDate: (date: Date) => void;
}>

export default function CalendarSlider({ selectedDate, onSelectDate }: CalendarSliderProps) {
    const [weekOffset, setWeekOffset] = useState(0);
    const [isOutOfLimit, setIsOutOfLimit] = useState(false);

    const translateX = useRef(new Animated.Value(0)).current;
    const [direction, setDirection] = useState<'left' | 'right'>('right');

    const animateSlide = (dir: 'left' | 'right') => {
        setDirection(dir);

        const toValue = dir === 'left' ? -wp(100) : wp(100); // slide trái/phải

        // slide ra
        Animated.timing(translateX, {
            toValue,
            duration: 30,
            useNativeDriver: true,
        }).start(() => {
            // reset vị trí và slide vào lại
            translateX.setValue(dir === 'left' ? wp(100) : -wp(100));
            Animated.timing(translateX, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start();
        });
    };

    const days = useMemo(() => {
        const start = moment().add(weekOffset, 'weeks').startOf('week');
        return Array.from({ length: 7 }).map((_, index) => {
            const date = moment(start).add(index, 'days');
            return {
                label: date.format('ddd').toUpperCase(),
                date: date.date(),
                fullDate: date.toDate(),
            };
        });
    }, [weekOffset]);

    const handlePrevWeek = () => {
        setWeekOffset(prev => prev - 1);
        animateSlide('right');
        setIsOutOfLimit(false);
    };

    const handleNextWeek = () => {
        if (weekOffset < 2) {
            animateSlide('left');
            setWeekOffset(prev => prev + 1);
        }
        if (weekOffset >= 1) {
            setIsOutOfLimit(true);
        }
    };

    const dateDisplay = useMemo(() => {
        const yesterday = moment().subtract(1, 'days').startOf('day');
        const today = moment().startOf('day');
        const tomorrow = moment().add(1, 'days').startOf('day');
        const selectedDateMoment = moment(selectedDate).startOf('day');

        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(selectedDate);
        const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(selectedDate);
        const date = selectedDate.getDate();
        let day;
        switch (true) {
            case selectedDateMoment.isSame(yesterday):
                day = 'Yesterday';
                break;
            case selectedDateMoment.isSame(today):
                day = 'Today';
                break;
            case selectedDateMoment.isSame(tomorrow):
                day = 'Tomorrow';
                break;
            default:
                day = weekday;
                break;
        }

        return { day, weekday, month, date };
    }, [selectedDate]);

    return (
        <SafeAreaView>
            <View className='pt-6 pb-2'>
                <Text style={{ fontSize: hp(4.2) }} className="text-white text-2xl font-bold pt-2">{dateDisplay.day}</Text>
                <Text style={{ fontSize: hp(2.8) }} className="text-[#DDDDDD] font-semibold text-lg mt-1">{dateDisplay.weekday}, {dateDisplay.month} {dateDisplay.date}</Text>
            </View>

            <View className="flex-row justify-between mt-4">
                {/* Tuần navigation */}
                <TouchableOpacity onPress={handlePrevWeek} className='justify-center'>
                    <Ionicons name="chevron-back" size={30} color="white" />
                </TouchableOpacity>

                {/* Lịch ngang */}
                <Animated.View style={{ transform: [{ translateX }] }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                        {days.map((day, index) => {
                            const isSelected =
                                new Date(day.fullDate).toDateString() === selectedDate.toDateString();
                            const isFutureDate = moment(day.fullDate).isAfter(moment(), 'day');

                            const bgColor = isSelected ? 'bg-[#182C47]' : isFutureDate ? 'bg-gray-400' : 'bg-white';

                            return (
                                <TouchableOpacity
                                    key={day.fullDate.toString()}
                                    className="items-center mx-2"
                                    onPress={() => onSelectDate(day.fullDate)}
                                >
                                    <Text className={`text-sm text-center ${isFutureDate ? 'font-normal' : 'font-bold'} ${isSelected ? 'text-[#182C47]' : 'text-white'}`}>
                                        {day.label}
                                    </Text>
                                    <View className={`w-8 h-8 mt-1 rounded-full items-center justify-center ${bgColor}`}>
                                        <Text className={`text-base font-bold ${isSelected ? 'text-white' : 'text-teal-600'}`}>
                                            {day.date}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </Animated.View>
                <TouchableOpacity onPress={handleNextWeek} className='justify-center'>
                    {isOutOfLimit ?
                        <Ionicons name="chevron-forward" size={30} color="gray" />
                        :
                        <Ionicons name="chevron-forward" size={30} color="white" />
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}