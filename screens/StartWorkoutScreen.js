import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../utils/colors";
import {
  getCustomExercises,
  getDeletedExercises,
  getTrainingGoal,
  getGymFrequency,
  saveWorkoutHistory,
  saveWorkoutInProgress,
  getWorkoutInProgress,
  clearWorkoutInProgress,
} from "../utils/encryptedStorage";
import { getTodayWorkoutPlan } from "../utils/generatePlan";

const getRepsAndSets = (goal) => {
  const randBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const strength = { sets: randBetween(4, 5), reps: randBetween(4, 6) };
  const hypertrophy = { sets: randBetween(3, 4), reps: randBetween(8, 12) };

  if (goal === "Strength") {
    return strength;
  }
  if (goal === "Hypertrophy") {
    return hypertrophy;
  }
};

export default function StartWorkoutScreen() {
  const [workout, setWorkout] = useState([]);
  const [goal, setGoal] = useState("Both");
  const [setProgress, setSetProgress] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const totalSets = workout.reduce((sum, ex) => sum + ex.sets, 0);

  const completedSets = setProgress.reduce((sum, exSets) => {
    return sum + exSets.filter((done) => done).length;
  }, 0);

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
          index === self.findIndex((e) => e.name === ex.name) &&
          !deleted.includes(ex.name)
      );

      const todayPlan = getTodayWorkoutPlan(allExercises, frequency);

      const withRepsSets = todayPlan.map((ex) => ({
        ...ex,
        ...getRepsAndSets(goal),
      }));

      setWorkout(withRepsSets);
      setGoal(goal);

      await saveWorkoutInProgress({
        workout: withRepsSets,
        goal,
        setProgress: withRepsSets.map((ex) => Array(ex.sets).fill(false)),
      });

      //Run alert after React updates state
      if (withRepsSets.length === 0) {
        setTimeout(() => {
          Alert.alert(
            "No Exercises Found",
            'You have no exercises saved. Please add some in the "Select Exercises" tab.'
          );
        }, 0);
      }

      //Create a false-filler array for each exercise's sets
      const initalProgress = withRepsSets.map((ex) =>
        Array.apply(ex.sets).fill(false)
      );
      setSetProgress(initalProgress);
    };

    const checkInProgress = async () => {
      const saved = await getWorkoutInProgress();

      if (saved) {
        Alert.alert(
          "Resume Workout?",
          "You had a workout in progress. Want to continue it?",
          [
            {
              text: "No, start fresh",
              onPress: () => {
                clearWorkoutInProgress();
                loadWorkout();
                setStartTime(Date.now());
              },
              style: "destructive",
            },
            {
              text: "Yes, continue",
              onPress: () => {
                setWorkout(saved.workout);
                setGoal(saved.goal);
                setSetProgress(saved.setProgress);
                setStartTime(saved.startTime);
              },
            },
          ]
        );
      } else {
        loadWorkout();
        setStartTime(Date.now());
      }
    };

    checkInProgress();
  }, []);

  const toggleSet = (exerciseIndex, setIndex) => {
    setSetProgress((prev) => {
      const updated = [...prev];
      updated[exerciseIndex] = [...updated[exerciseIndex]];
      updated[exerciseIndex][setIndex] = !updated[exerciseIndex][setIndex];
      return updated;
    });
  };

  const handleNextSet = () => {
    const currentExercise = workout[currentExerciseIndex];
    const currentSetCount = currentExercise.sets;

    //Mark set as completed
    setSetProgress((prev) => {
      const updated = [...prev];
      updated[currentExerciseIndex] = [...updated[currentExerciseIndex]];
      updated[currentExerciseIndex][currentSetIndex] = true;
      return updated;
    });

    //Advance to next set/exercise
    const isLastSet = currentSetIndex + 1 >= currentSetCount;
    const isLastExercise = currentExerciseIndex + 1 >= workout.length;

    if (isLastSet) {
      if (isLastExercise) {
        completeAndSaveWorkout();
        return;
      }
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSetIndex(0);
    } else {
      setCurrentSetIndex((prev) => prev + 1);
    }
  };

  const completeAndSaveWorkout = async () => {
    const now = new Date().toISOString();
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    const durationMinutes = Math.round(durationMs / 60000);

    const completed = workout.map((ex, i) => ({
      name: ex.name,
      category: ex.category,
      sets: ex.sets,
      reps: ex.reps,
      completedSets: setProgress[i],
    }));

    const entry = {
      date: now,
      goal,
      duration: durationMinutes,
      exercises: completed,
    };

    await saveWorkoutHistory(entry);
    Alert.alert("Workout Saved", `Logged! Duration ${durationMinutes} min`);
  };

  const handleCompleteWorkout = () => {
    completeAndSaveWorkout();
  };

  const allSetsCompleted =
    workout.length > 0 &&
    setProgress.every((exerciseSets) =>
      exerciseSets.every((set) => set === true)
    );

  const isWorkoutInProgress =
    workout.length > 0 &&
    setProgress.length > 0 &&
    setProgress.some((exerciseSets) =>
      exerciseSets.some((set) => set === false)
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Today's Workout ({goal})</Text>
      <Text style={styles.setCounter}>
        {completedSets} of {totalSets} sets completed
      </Text>
      <View style={styles.progressTracker}>
        <Text style={styles.progressTitle}>Now Doing:</Text>
        {workout[currentExerciseIndex] && (
          <Text style={styles.progressDetail}>
            {workout[currentExerciseIndex].name} - Set {currentSetIndex + 1}
          </Text>
        )}
      </View>
      {workout.length === 0 ? (
        <Text style={styles.empty}>
          No workout for today. Add exercises in the "Select Exercises" screen.
        </Text>
      ) : (
        workout.map((ex, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseCategory}>{ex.category}</Text>
            <View style={styles.setList}>
              {Array.from({ length: ex.sets }).map((_, setIdx) => (
                <TouchableOpacity
                  key={setIdx}
                  style={[
                    styles.setItem,
                    setProgress[index]?.[setIdx] && styles.setItemDone,
                  ]}
                  onPress={() => toggleSet(index, setIdx)}
                  disabled={setProgress[index]?.[setIdx]} //Prevent re-tap if already done
                >
                  <Text style={styles.setText}>
                    {setProgress[index][setIdx] ? "✅ " : ""} Set {setIdx + 1}:{" "}
                    {ex.reps} reps
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}
      {isWorkoutInProgress && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextSet}>
          <Text style={styles.nextButtonText}>Next Set</Text>
        </TouchableOpacity>
      )}
      {allSetsCompleted && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteWorkout}
        >
          <Text style={styles.completeButtonText}>Complete Workout</Text>
        </TouchableOpacity>
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
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: COLORS.textPrimary,
  },
  setCounter: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  progressTracker: {
    alignItems: "center",
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  progressDetail: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  exerciseCategory: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  exerciseRepsSets: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 8,
    color: COLORS.textSecondary,
  },
  setList: {
    marginTop: 8,
  },
  setItem: {
    padding: 10,
    backgroundColor: COLORS.card,
    borderColor: COLORS.purple,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 6,
    opacity: 1,
  },
  setItemDone: {
    backgroundColor: "#4caf50",
    opacity: 0.6,
  },
  setText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  empty: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 32,
  },
  nextButton: {
    backgroundColor: COLORS.purple,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  nextButtonText: {
    color: COLORS.buttonText,
    fontWeight: "bold",
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: COLORS.purple,
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  completeButtonText: {
    color: COLORS.buttonText,
    fontWeight: "bold",
    fontSize: 16,
  },
});
