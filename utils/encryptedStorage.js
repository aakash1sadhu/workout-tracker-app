import EncryptedStorage from 'react-native-encrypted-storage';

const EXERCISES_KEY = 'favouriteExercises';
const FREQ_KEY = 'gymFrequency';
const LOGS_KEY = 'workoutLogs';
const CUSTOM_EXERCISES_KEY = 'customExercises';
const DELETED_KEY = 'deleted_exercises';

export async function saveFavouriteExercises(exercises) {
  try {
    await EncryptedStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  } catch (err) {
    console.error('Error saving favourite exercises:', err);
  }
}

export async function getFavouriteExercises() {
  try {
    const data = await EncryptedStorage.getItem(EXERCISES_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error loading favourite exercises:', err);
    return null;
  }
}

export async function saveGymFrequency(days) {
  try {
    await EncryptedStorage.setItem(FREQ_KEY, days.toString());
  } catch (err) {
    console.error('Error saving gym frequency', err);
  }
}

export async function getGymFrequency() {
  try {
    const days = await EncryptedStorage.getItem(FREQ_KEY);
    return days ? parseInt(days, 10) : 3; //default to 3 days per week
  } catch (err) {
    console.error('Error loading gym frequency', err);
    return 3;
  }
}

export async function saveWorkoutLog(newLog) {
  try {
    const existingLogs = await EncryptedStorage.getItem(LOGS_KEY);
    const logs = existingLogs ? JSON.parse(existingLogs) : [];

    logs.push(newLog);
    await EncryptedStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.err('Error saving workout log', err);
  }
}

export async function getWorkoutLogs() {
  try {
    const logs = await EncryptedStorage.getItem(LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (err) {
    console.error('Error loading workout logs', err);
    return [];
  }
}

export async function clearWorkoutLogs() {
  try {
    await EncryptedStorage.removeItem('workoutLogs');
  } catch (err) {
    console.error('Error clearing workout logs', err);
  }
}

export async function saveCustomExercise(exercise) {
  try {
    const existing = await EncryptedStorage.getItem(CUSTOM_EXERCISES_KEY);
    const exercises = existing ? JSON.parse(existing) : [];
    exercises.push(exercise);
    await EncryptedStorage.setItem(
      CUSTOM_EXERCISES_KEY,
      JSON.stringify(exercises),
    );
  } catch (err) {
    console.error('Error saving custom exercise', err);
  }
}

export async function getCustomExercises() {
  try {
    const saved = await EncryptedStorage.getItem(CUSTOM_EXERCISES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Error loading custom exercises', err);
    return [];
  }
}

export async function removeCustomExercise(nameToRemove) {
  try {
    const saved = await getCustomExercises();
    const updated = saved.filter(ex => ex.name !== nameToRemove);
    await EncryptedStorage.setItem('custom_exercises', JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to remove exercise:', err);
    return [];
  }
}

export async function getDeletedExercises() {
  try {
    const raw = await EncryptedStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveDeletedExercise(nameToDelete) {
  try {
    const current = await getDeletedExercises();
    const updated = [...new Set([...current, nameToDelete])];
    await EncryptedStorage.setItem(DELETED_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving deleted exercise', err);
  }
}
