import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA6d5xGtvk2mXMxBux4-zhuEwlgH6eBhRc",
  authDomain: "flavorfind-8fec7.firebaseapp.com",
  projectId: "flavorfind-8fec7",
  storageBucket: "flavorfind-8fec7.appspot.com", // 🔧 You had a typo here
  messagingSenderId: "712957585673",
  appId: "1:712957585673:web:ff63c7cf59984c16a64bd8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Properly initialize Auth for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
