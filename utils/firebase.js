// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA1ay3NtSISxZ9peiu-22aKReqa5T6pbI4',
  authDomain: 'workout-tracker-3047a.firebaseapp.com',
  projectId: 'workout-tracker-3047a',
  storageBucket: 'workout-tracker-3047a.firebasestorage.app',
  messagingSenderId: '96940454378',
  appId: '1:96940454378:web:c6c08e007556e9c2478293',
  measurementId: 'G-5BZ5J1WG95',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
