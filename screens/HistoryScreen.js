import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {parseISO, format} from 'date-fns';
import {getWorkoutLogs} from '../utils/encryptedStorage';
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📆 Workout History</Text>
      {logs.length === 0 ? (
        <Text style={styles.emptyText}>No workouts logged yet.</Text>
      ) : (
        logs.map((log, index) => (
          <View key={index} style={styles.logCard}>
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
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  },
  logCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 10,
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
