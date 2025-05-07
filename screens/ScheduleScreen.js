import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {saveWorkout} from '../utils/storage';

export default function ScheduleScreen() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleSchedule = async () => {
    if (!name || !date) {
      Alert.alert('Please fill out both fields');
      return;
    }

    //YYYY-MM_DD format check
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (!isValidDate) {
      Alert.alert('Please use date format: YYYY-MM-DD');
      return;
    }

    const workout = {
      name,
      date,
      createdAt: new Date().toISOString(),
    };

    await saveWorkout(workout);
    Alert.alert('✅ Workout scheduled!');
    setName('');
    setDate('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Schedule a Workout</Text>

      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Date (e.g 2024-12-01)"
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity style={styles.button} onPress={handleSchedule}>
        <Text style={styles.buttonText}>Save Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 24,
    alignSelf: 'center',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
