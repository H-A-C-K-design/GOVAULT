import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Read Vite Environment Variables safely
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC1H8wBWG01MlfpV7mZemBLx6ezgLp1cdk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "govermentvault.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "govermentvault",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "govermentvault.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "102753151068686475143",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:102753151068686475143:web:9c99ec00dcf5c6a683ed1a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YD3X3K86Q9"
};

// Check if valid user-configured Firebase credentials exist
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyDemoKeyGovDocWeb2026Secure"
);

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally (only in browser environment if supported)
export const analyticsPromise = isSupported().then((supported) => supported ? getAnalytics(app) : null);

export default app;

