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
import {getWorkoutLogs, clearWorkoutLogs} from '../utils/encryptedStorage';
import {COLORS} from '../utils/colors';

export default function HistoryScreen() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      const stored = await getWorkoutLogs();
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
            await clearWorkoutLogs();
            setLogs([]);
          },
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📆 Workout History</Text>
      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity>
      {logs.length === 0 ? (
        <Text style={styles.emptyText}>No workouts logged yet.</Text>
      ) : (
        logs.map((log, index) => (
          <View key={index} style={styles.logCard}>
            <Text style={styles.logTitle}>Workout #{logs.length - index}</Text>
            <Text style={styles.date}>
              {format(parseISO(log.date), 'EEEE do MMMM yyyy')}
            </Text>
            {log.exercises.map((ex, i) => (
              <Text key={i} style={styles.exercise}>
                • {ex}
              </Text>
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
  exercise: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
