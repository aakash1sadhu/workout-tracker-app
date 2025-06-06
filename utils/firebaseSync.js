import {collection, doc, setDoc, getDocs} from 'firebase/firestore';
import {db, auth} from './firebase';

export async function uploadCustomExercises(
  userId = auth.currentUser ? auth.currentUser.uid : 'demoUser',
  exercises,
) {
  try {
    const ref = doc(collection(db, 'users', userId, 'data'), 'customExercises');
    await setDoc(ref, {exercises});
    console.log('✅ Synced custom exercises to Firebase');
  } catch (err) {
    console.error('❌ Error syncing custom exercises:', err);
  }
}

export async function uploadWorkoutHistory(
  userId = auth.currentUser ? auth.currentUser.uid : 'demoUser',
  history,
) {
  try {
    const ref = doc(collection(db, 'users', userId, 'data'), 'workoutHistory');
    await setDoc(ref, {history});
    console.log('✅ Synced workout history to Firebase');
  } catch (err) {
    console.error('❌ Error syncing workout history:', err);
  }
}
