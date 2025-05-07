import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {
  saveFavouriteExercises,
  getFavouriteExercises,
} from '../utils/encryptedStorage';
import {COLORS} from '../utils/colors';

const ALL_EXERCISES = [
  {name: 'bench press', category: 'Upper'},
  {name: 'squats', category: 'Lower'},
  {name: 'deadlift', category: 'Back'},
  {name: 'pull-ups', category: 'Back'},
  {name: 'shoulder press', category: 'Upper'},
  {name: 'lunges', category: 'Lower'},
  {name: 'burpees', category: 'Full'},
];

export default function ExerciseSelectScreen({navigation}) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const load = async () => {
      const saved = await getFavouriteExercises();
      if (saved) setSelected(saved.map(e => e.name));
    };
    load();
  }, []);

  const toggleExercise = name => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name],
    );
  };

  const saveAndGoBack = async () => {
    const filtered = ALL_EXERCISES.filter(ex => selected.includes(ex.name));
    await saveFavouriteExercises(filtered);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Favourite Exercises</Text>
      <FlatList
        data={ALL_EXERCISES}
        keyExtractor={item => item.name}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.item,
              selected.includes(item.name) && styles.itemSelected,
            ]}
            onPress={() => toggleExercise(item.name)}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveAndGoBack}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  item: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemSelected: {
    backgroundColor: COLORS.purple,
  },
  itemText: {
    color: COLORS.textPrimary,
    fontSize: 16,
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
});
