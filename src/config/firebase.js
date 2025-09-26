// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import config from '../config/config.js';

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
  analytics = getAnalytics(app);
}
export { analytics };

// Connect to emulators in development
if (config.app.environment === 'development') {
  // Only connect to emulators if not already connected
  try {
    // Auth emulator
    if (!auth._delegate?._config?.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }
    
    // Firestore emulator
    if (!db._delegate?._databaseId?.projectId?.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    // Storage emulator
    if (!storage._delegate?._host?.includes('localhost')) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  } catch (error) {
    // Emulators might already be connected or not running
    console.warn('Firebase emulator connection warning:', error.message);
  }
}

export default app;