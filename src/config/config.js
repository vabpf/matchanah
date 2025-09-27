// Environment configuration
const config = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  },
  payos: {
    clientId: import.meta.env.VITE_PAYOS_CLIENT_ID,
    apiKey: import.meta.env.VITE_PAYOS_API_KEY,
    checksumKey: import.meta.env.VITE_PAYOS_CHECKSUM_KEY,
    environment: import.meta.env.VITE_PAYOS_ENVIRONMENT || 'development', // 'development' or 'production'
    returnUrl: import.meta.env.VITE_PAYOS_RETURN_URL || `${window?.location?.origin}/payment-return`,
    cancelUrl: import.meta.env.VITE_PAYOS_CANCEL_URL || `${window?.location?.origin}/payment-cancel`
  },
  app: {
    name: 'Matchanah',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development'
  }
};

export default config;
