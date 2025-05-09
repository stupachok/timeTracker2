import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';

export default function WeekDaySelector({ selectedDate, onSelectDate }) {
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    const today = startOfToday();
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const date = addDays(today, i);
      days.push(date);
    }
    setWeekDays(days);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weekDays.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[styles.dayButton, isSelected && styles.selectedButton]}
              onPress={() => onSelectDate(date)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedText]}>
                {format(date, 'EEE')}
              </Text>
              <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                {format(date, 'd MMM')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
});
