import EncryptedStorage from 'react-native-encrypted-storage';

const EXERCISES_KEY = 'favouriteExercises';
const FREQ_KEY = 'gymFrequency';
const LOGS_KEY = 'workoutLogs';
const CUSTOM_EXERCISES_KEY = 'customExercises';
const DELETED_KEY = 'deleted_exercises';
const TRAINING_GOAL_KEY = 'training_goal';
const HISTORY_KEY = 'workout_history';
const IN_PROGRESS_KEY = 'workout_in_progress';

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

export async function getWorkoutHistory() {
  try {
    const raw = await EncryptedStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error loading workout history', err);
    return [];
  }
}

export async function clearWorkoutHistory() {
  try {
    await EncryptedStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.error('Error clearing workout history', err);
  }
}

export async function saveCustomExercise(exercise) {
  try {
    const existing = await EncryptedStorage.getItem(CUSTOM_EXERCISES_KEY);
    const exercises = existing ? JSON.parse(existing) : [];
    const cleaned = {
      name: exercise.name.trim().toLowerCase(),
      category: exercise.category,
    };

    const alreadyExists = exercises.some(ex => ex.name === cleaned.name);
    if (alreadyExists) {
      console.log(`⛔ Exercise "${cleaned.name}" already exists`);
      return;
    }

    exercises.push(cleaned);
    await EncryptedStorage.setItem(
      CUSTOM_EXERCISES_KEY,
      JSON.stringify(exercises),
    );

    console.log('Saved exercise', exercises);
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
    await EncryptedStorage.setItem(
      CUSTOM_EXERCISES_KEY,
      JSON.stringify(updated),
    );
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

export async function saveTrainingGoal(goal) {
  try {
    await EncryptedStorage.setItem(TRAINING_GOAL_KEY, goal);
  } catch (err) {
    console.error('Error saving training goal:', err);
  }
}

export async function getTrainingGoal() {
  try {
    const goal = await EncryptedStorage.getItem(TRAINING_GOAL_KEY);
    return goal || 'Both'; //default to 'Both if nothing is set
  } catch {
    return 'Both';
  }
}

export async function saveWorkoutHistory(entry) {
  try {
    const raw = await EncryptedStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    history.unshift(entry); //add to top
    await EncryptedStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save workout history', err);
  }
}

export async function saveWorkoutInProgress({
  workout,
  goal,
  setProgress,
  startTime,
}) {
  try {
    await EncryptedStorage.setItem(
      IN_PROGRESS_KEY,
      JSON.stringify({
        workout,
        goal,
        setProgress,
        startTime: startTime ?? Date.now(),
      }),
    );
  } catch (err) {
    console.error('Failed to save workout in progress:', err);
  }
}

export async function getWorkoutInProgress() {
  try {
    const data = await EncryptedStorage.getItem(IN_PROGRESS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Failed to load workout in progress:', err);
    return null;
  }
}

export async function clearWorkoutInProgress() {
  try {
    await EncryptedStorage.removeItem(IN_PROGRESS_KEY);
  } catch (err) {
    console.error('Failed to clear workout in progress:', err);
  }
}
