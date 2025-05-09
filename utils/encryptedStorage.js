import EncryptedStorage from 'react-native-encrypted-storage';

const EXERCISES_KEY = 'favouriteExercises';
const FREQ_KEY = 'gymFrequency';
const LOGS_KEY = 'workoutLogs';

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
