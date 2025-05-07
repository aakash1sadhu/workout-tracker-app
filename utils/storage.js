import EncryptedStorage from 'react-native-encrypted-storage';

//save workout securely
export async function saveWorkout(workout) {
  try {
    await EncryptedStorage.setItem('latestWorkout', JSON.stringify(workout));
    console.log('✅ Workout save securely!!!!');
  } catch (error) {
    console.error('❌ Error saving workout:', error);
  }
}

//load workout securely
export async function loadWorkout() {
  try {
    const workout = await EncryptedStorage.getItem('latestWorkout');
    if (workout) {
      console.log('📦 Loaded workout:', JSON.parse(workout));
      return JSON.parse(workout);
    }
    console.log('ℹ️ No workout saved yet');
    return null;
  } catch (error) {
    console.error('❌ Error loading workout:', error);
    return null;
  }
}
