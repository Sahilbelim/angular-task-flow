import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
    apiKey: "AIzaSyAQBRPugUw61cMyRWVwPMW4xr2yfMW8CEA",
    authDomain: "task-manager-da756.firebaseapp.com",
    projectId: "task-manager-da756",
    storageBucket: "task-manager-da756.appspot.com",
    messagingSenderId: "249742761852",
    appId: "1:249742761852:web:f9b647c9733c33c49c8ef9",
    measurementId: "G-26DGSZM94Y"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Firebase Auth instance
export const auth = getAuth(firebaseApp);
