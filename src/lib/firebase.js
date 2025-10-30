// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQXMCf2E8dx9UdUc8mAcx4tKM3MnVdArY",
  authDomain: "chatsupplies-temp.firebaseapp.com",
  projectId: "chatsupplies-temp",
  storageBucket: "chatsupplies-temp.firebasestorage.app",
  messagingSenderId: "24581711005",
  appId: "1:24581711005:web:84848222b1b02341eaa074"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

// Initialize Analytics
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const provider = new GoogleAuthProvider();

// Analytics helper functions
const logAnalyticsEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

// Export everything you might need
export { 
  auth, 
  provider, 
  analytics,
  logAnalyticsEvent,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup 
};
export default app;