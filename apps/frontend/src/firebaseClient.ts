import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyFakeDemoKeyForYoGoSproutsApp2026',
  authDomain: 'yogo-sprouts-app.firebaseapp.com',
  projectId: 'yogo-sprouts-app',
  storageBucket: 'yogo-sprouts-app.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
