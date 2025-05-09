import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {getFavouriteExercises, saveWorkoutLog} from '../utils/encryptedStorage';
import {COLORS} from '../utils/colors';

export default function LogWorkoutScreen({navigation}) {
  const [exercises, setExercises] = useState([]);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const loadExercises = async () => {
      const saved = await getFavouriteExercises();
      if (saved) {
        setExercises(saved);
        const initialStatus = {};
        saved.forEach(ex => {
          initialStatus[ex.name] = false;
        });
        setCompleted(initialStatus);
      }
    };
    loadExercises();
  }, []);

  const toggleCompleted = name => {
    setCompleted(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSave = async () => {
    const today = new Date().toISOString().split('T')[0];
    const log = {
      date: today,
      exercises: Object.entries(completed)
        .filter(([_, done]) => done)
        .map(([name]) => name),
    };

    await saveWorkoutLog(log);
    Alert.alert('Workout logged! 💪🏽');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Today's Workout</Text>
      {exercises.map(ex => (
        <TouchableOpacity
          key={ex.name}
          style={[
            styles.exerciseCard,
            completed[ex.name] && styles.exerciseCardActive,
          ]}
          onPress={() => toggleCompleted(ex.name)}>
          <Text style={styles.exerciseText}>{ex.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Log</Text>
      </TouchableOpacity>
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
  exerciseCard: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 8,
  },
  exerciseCardActive: {
    backgroundColor: COLORS.purple,
  },
  exerciseText: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.purple,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: COLORS.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
