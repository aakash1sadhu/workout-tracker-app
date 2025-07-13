import * as SecureStore from "expo-secure-store";

// Generic helpers
async function saveItem(key, value) {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

async function getItem(key, fallback = null) {
  const value = await SecureStore.getItemAsync(key);
  return value ? JSON.parse(value) : fallback;
}

async function removeItem(key) {
  await SecureStore.deleteItemAsync(key);
}

// Keys
const EXERCISES_KEY = "favouriteExercises";
const FREQ_KEY = "gymFrequency";
const LOGS_KEY = "workoutLogs";
const CUSTOM_EXERCISES_KEY = "customExercises";
const DELETED_KEY = "deleted_exercises";
const TRAINING_GOAL_KEY = "training_goal";
const HISTORY_KEY = "workout_history";
const IN_PROGRESS_KEY = "workout_in_progress";

// Exercise Storage
export const saveFavouriteExercises = (exercises) =>
  saveItem(EXERCISES_KEY, exercises);
export const getFavouriteExercises = () => getItem(EXERCISES_KEY, []);

export const saveCustomExercise = async (exercise) => {
  const cleaned = {
    name: exercise.name.trim().toLowerCase(),
    category: exercise.category,
  };
  const existing = await getCustomExercises();
  const alreadyExists = existing.some((ex) => ex.name === cleaned.name);
  if (alreadyExists) return;
  existing.push(cleaned);
  await saveItem(CUSTOM_EXERCISES_KEY, existing);
};

export const getCustomExercises = () => getItem(CUSTOM_EXERCISES_KEY, []);
export const removeCustomExercise = async (name) => {
  const existing = await getCustomExercises();
  const updated = existing.filter((ex) => ex.name !== name);
  await saveItem(CUSTOM_EXERCISES_KEY, updated);
  return updated;
};

// Frequency and Goal
export const saveGymFrequency = (days) => saveItem(FREQ_KEY, days);
export const getGymFrequency = async () =>
  parseInt(await getItem(FREQ_KEY, 3), 10);

export const saveTrainingGoal = (goal) => saveItem(TRAINING_GOAL_KEY, goal);
export const getTrainingGoal = () => getItem(TRAINING_GOAL_KEY, "Both");

// Deleted exercises
export const getDeletedExercises = () => getItem(DELETED_KEY, []);
export const saveDeletedExercise = async (name) => {
  const current = await getDeletedExercises();
  const updated = [...new Set([...current, name])];
  await saveItem(DELETED_KEY, updated);
};

// Workout History
export const saveWorkoutHistory = async (entry) => {
  const history = await getWorkoutHistory();
  history.unshift(entry);
  await saveItem(HISTORY_KEY, history);
};

export const getWorkoutHistory = () => getItem(HISTORY_KEY, []);
export const clearWorkoutHistory = () => removeItem(HISTORY_KEY);

// Workout In Progress
export const saveWorkoutInProgress = (data) => saveItem(IN_PROGRESS_KEY, data);
export const getWorkoutInProgress = () => getItem(IN_PROGRESS_KEY, null);
export const clearWorkoutInProgress = () => removeItem(IN_PROGRESS_KEY);
