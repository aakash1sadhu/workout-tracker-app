import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import {COLORS} from '../utils/colors';
import {
  getCustomExercises,
  getDeletedExercises,
  getTrainingGoal,
  getGymFrequency,
} from '../utils/encryptedStorage';
import {getTodayWorkoutPlan} from '../utils/generatePlan';

const getRepsAndSets = goal => {
  const randBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const strength = {sets: randBetween(4, 5), reps: randBetween(4, 6)};
  const hypertrophy = {sets: randBetween(3, 4), reps: randBetween(8, 12)};

  if (goal === 'Strength') {
    return strength;
  }
  if (goal === 'Hypertrophy') {
    return hypertrophy;
  }
};

export default function StartWorkoutScreen() {
  const [workout, setWorkout] = useState([]);
  const [goal, setGoal] = useState('Both');

  useEffect(() => {
    const loadWorkout = async () => {
      const [customExercises, deleted, goal, frequency] = await Promise.all([
        getCustomExercises(),
        getDeletedExercises(),
        getTrainingGoal(),
        getGymFrequency(),
      ]);

      const allExercises = customExercises.filter(
        (ex, index, self) =>
          index === self.findIndex(e => e.name === ex.name) &&
          !deleted.includes(ex.name),
      );

      const todayPlan = getTodayWorkoutPlan(allExercises, frequency);

      const withRepsSets = todayPlan.map(ex => ({
        ...ex,
        ...getRepsAndSets(goal),
      }));

      setWorkout(withRepsSets);
      setGoal(goal);

      //Run alert after React updates state
      if (withRepsSets.length === 0) {
        setTimeout(() => {
          Alert.alert(
            'No Exercises Found',
            'You have no exercises saved. Please add some in the "Select Exercises" tab.',
          );
        }, 0);
      }
    };

    loadWorkout();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Today's Workout ({goal})</Text>
      {workout.length === 0 ? (
        <Text style={styles.empty}>
          No workout for today. Add exercises in the "Select Exercises" screen.
        </Text>
      ) : (
        workout.map((ex, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseCategory}>{ex.category}</Text>
            <Text style={styles.exerciseRepsSets}>
              {ex.sets} sets x {ex.reps} reps
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  exerciseCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  exerciseCategory: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  exerciseRepsSets: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
    color: COLORS.textSecondary,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 32,
  },
});
