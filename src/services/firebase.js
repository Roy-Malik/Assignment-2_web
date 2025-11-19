import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1ZDz5uUjKwL8DF6ofH-uuCQwE_6IBImQ",
  authDomain: "groovify-music.firebaseapp.com",
  projectId: "groovify-music",
  storageBucket: "groovify-music.firebasestorage.app",
  messagingSenderId: "418299182526",
  appId: "1:418299182526:web:6c5b41e5ea4afebd730def",
  measurementId: "G-TZBVB65XK0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);