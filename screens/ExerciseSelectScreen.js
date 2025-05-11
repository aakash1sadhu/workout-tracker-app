import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {COLORS} from '../utils/colors';
import {
  saveCustomExercise,
  getCustomExercises,
  removeCustomExercise,
  getDeletedExercises,
  saveDeletedExercise,
} from '../utils/encryptedStorage';

const ALL_EXERCISES = [
  {name: 'bench press', category: 'Upper'},
  {name: 'squats', category: 'Lower'},
  {name: 'deadlift', category: 'Back'},
  {name: 'pull-ups', category: 'Back'},
  {name: 'shoulder press', category: 'Upper'},
  {name: 'lunges', category: 'Lower'},
  {name: 'burpees', category: 'Full'},
];

export default function SelectExercisesScreen() {
  const [exerciseName, setExerciseName] = useState('');
  const [category, setCategory] = useState(null);
  const [allExercises, setAllExercises] = useState(ALL_EXERCISES);

  const handleSave = async () => {
    if (!exerciseName || !category) {
      Alert.alert('Please enter a name and select a category');
      return;
    }

    const cleanedName = exerciseName.trim().toLowerCase();
    const newExercise = {
      name: cleanedName,
      category,
    };

    await saveCustomExercise(newExercise);
    Alert.alert('Exercise saved!');
    setExerciseName('');
    setCategory(null);
  };

  const handleDelete = async name => {
    const isCustom = await getCustomExercises().then(list =>
      list.some(ex => ex.name === name),
    );

    if (isCustom) {
      await removeCustomExercise(name);
    }

    await saveDeletedExercise(name);

    //Reload visible exercises
    const saved = await getCustomExercises();
    const deleted = await getDeletedExercises();

    const merged = [...ALL_EXERCISES, ...saved];
    const unique = merged.filter(
      (ex, index, self) => index === self.findIndex(e => e.name === ex.name),
    );
    const filtered = unique.filter(ex => !deleted.includes(ex.name));

    setAllExercises(filtered);
  };

  const handleResetAll = async () => {
    try {
      await EncryptedStorage.removeItem('deleted_exercises');
      const saved = await getCustomExercises();

      const merged = [...ALL_EXERCISES, ...saved];
      const unique = merged.filter(
        (ex, index, self) => index === self.findIndex(e => e.name === ex.name),
      );

      setAllExercises(unique);
      Alert.alert('Reset complete', 'All exercises have been restored.');
    } catch (err) {
      console.error('Failed to reset deleted exercises', err);
    }
  };

  useEffect(() => {
    const loadSavedExercises = async () => {
      const saved = await getCustomExercises();
      const deleted = await getDeletedExercises();

      //Merge and deduplicate by name
      const merged = [...ALL_EXERCISES, ...saved];
      const unique = merged.filter(
        (ex, index, self) => index === self.findIndex(e => e.name === ex.name),
      );

      //Remove any that were deleted
      const filtered = unique.filter(ex => !deleted.includes(ex.name));

      setAllExercises(filtered);
    };
    loadSavedExercises();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Add New Exercise</Text>

      <TextInput
        style={styles.input}
        placeholder="Exercise name"
        value={exerciseName}
        onChangeText={setExerciseName}
      />

      <Text style={styles.label}>Select a category</Text>
      {['Upper', 'Lower', 'Back', 'Full'].map(cat => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.categoryButton,
            category === cat && styles.categoryButtonActive,
          ]}
          onPress={() => setCategory(cat)}>
          <Text
            style={[
              styles.categoryText,
              category === cat && styles.categoryTextSelected,
            ]}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Exercise</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Your Exercises</Text>
      <View style={styles.exerciseList}>
        {allExercises.map((ex, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseCategory}>{ex.category}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(ex.name)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={handleResetAll}>
        <Text style={styles.resetButtonText}>Reset All Exercises</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingBottom: 40,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.card,
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  categoryTextSelected: {
    color: COLORS.buttonText,
  },
  categoryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    marginBottom: 10,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.purple,
  },
  categoryText: {
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.purple,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  exerciseList: {
    paddingBottom: 40,
  },
  exerciseItem: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  exerciseCategory: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: '#ff4d4d', // red to signal delete
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start', // keeps button left-aligned
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: COLORS.purple,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
