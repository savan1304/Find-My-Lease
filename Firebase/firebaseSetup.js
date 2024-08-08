// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'

import { apiKeyE, authDomainE, projectIdE, storageBucketE, messagingSenderIdE, appIdE } from '@env'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: apiKeyE,
    authDomain: authDomainE,
    projectId: projectIdE,
    storageBucket: storageBucketE,
    messagingSenderId: messagingSenderIdE,
    appId: appIdE
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)
export const storage = getStorage(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

