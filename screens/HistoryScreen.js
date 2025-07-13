import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {parseISO, format} from 'date-fns';
import {
  getWorkoutHistory,
  clearWorkoutHistory,
} from '../utils/encryptedStorage';
import {COLORS} from '../utils/colors';
import {Calendar} from 'react-native-calendars';

export default function HistoryScreen() {
  const [logs, setLogs] = useState([]);
  const [calendarMode, setCalendarMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const loadLogs = async () => {
      const stored = await getWorkoutHistory();
      setLogs(stored.reverse()); //Most recent logs first
    };
    loadLogs();
  }, []);

  const handleClear = async () => {
    Alert.alert(
      'Clear All Logs?',
      'Are you sure you want to delete all your workout history?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Yes, clear it',
          style: 'destructive',
          onPress: async () => {
            await clearWorkoutHistory();
            setLogs([]);
          },
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📆 Workout History</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setCalendarMode(!calendarMode)}>
        <Text style={styles.toggleButtonText}>
          {calendarMode ? 'Switch to List View' : 'Switch to Calendar View'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity>
      {logs.length === 0 ? (
        <Text style={styles.emptyText}>No workouts logged yet.</Text>
      ) : calendarMode ? (
        <>
          <Calendar
            markedDates={logs.reduce((acc, log) => {
              const date = log.date.split('T')[0]; //format YYYY-MM-DD
              acc[date] = {
                marked: true,
                dotColor: COLORS.purple,
                selected: date === selectedDate,
                selectedColor: COLORS.purple,
              };
              return acc;
            }, {})}
            onDayPress={day => setSelectedDate(day.dateString)}
            theme={{
              selectedDayBackgroundColor: COLORS.purple,
              todayTextColor: COLORS.textSecondary,
              arrowColor: COLORS.purple,
            }}
          />
          <Text style={styles.subTitle}>
            {selectedDate
              ? `Workouts on ${format(
                  parseISO(selectedDate),
                  'EEEE do MMMM yyyy',
                )}`
              : 'Select a day to see your workout'}
          </Text>
          {selectedDate &&
            logs
              .filter(log => log.date.startsWith(selectedDate))
              .map((log, index) => (
                <View key={index} style={styles.logCard}>
                  <Text style={styles.logTitle}>Goal: {log.goal}</Text>
                  <Text style={styles.duration}>
                    Duration: {log.duration || '?'} min
                  </Text>
                  {log.exercises.map((ex, i) => (
                    <View key={i} style={styles.exerciseGroup}>
                      <Text style={styles.exercise}>
                        • {ex.name} ({ex.category})
                      </Text>
                      <Text style={styles.setDetail}>
                        {ex.completedSets?.filter(Boolean).length || 0} /{' '}
                        {ex.sets} sets completed
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
        </>
      ) : (
        logs.map((log, index) => (
          <View key={index} style={styles.logCard}>
            <Text style={styles.logTitle}>Workout #{logs.length - index}</Text>
            <Text style={styles.date}>
              {format(parseISO(log.date), 'EEEE do MMMM yyyy')}
            </Text>
            <Text style={styles.duration}>
              Duration: {log.duration || '?'} min
            </Text>
            {log.exercises.map((ex, i) => (
              <View key={i} style={styles.exerciseGroup}>
                <Text style={styles.exercise}>
                  • {ex.name} ({ex.category})
                </Text>
                <Text style={styles.setDetail}>
                  {ex.completedSets?.filter(Boolean).length || 0} / {ex.sets}{' '}
                  sets completed
                </Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
  toggleButtonText: {
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: COLORS.purple,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'center',
  },
  clearButtonText: {
    color: COLORS.buttonText,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  },
  logCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: COLORS.purple,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  duration: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  exercise: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  exerciseGroup: {
    marginBottom: 6,
  },
  setDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
});
