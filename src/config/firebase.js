// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import config from '../config/config.js';

// Validate Firebase config
if (!config.firebase.apiKey || !config.firebase.projectId) {
  throw new Error('Firebase configuration is missing. Please check your .env file.');
}

// Initialize Firebase
const app = initializeApp(config.firebase);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics (optional - for production)
let analytics = null;
if (typeof window !== 'undefined' && config.firebase.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error.message);
  }
}
export { analytics };

export default app;