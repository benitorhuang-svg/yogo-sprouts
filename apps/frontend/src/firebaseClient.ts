import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBbCtf0rbvPF-lwXBG0G9EMk_edez6GYxY',
  authDomain: 'yogo-sprouts-app.firebaseapp.com',
  projectId: 'yogo-sprouts-app',
  storageBucket: 'yogo-sprouts-app.firebasestorage.app',
  messagingSenderId: '160408920091',
  appId: '1:160408920091:web:82cb19dfff9f2e8faf98be',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
