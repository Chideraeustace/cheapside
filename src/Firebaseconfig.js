import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - replace with your actual credentials
const firebaseConfig = {
  apiKey: "AIzaSyDFTdiGj9lwm6te-BrAjblKxue7b7AxIJE",
  authDomain: "login-60ced.firebaseapp.com",
  projectId: "login-60ced",
  storageBucket: "login-60ced.firebasestorage.app",
  messagingSenderId: "883667275503",
  appId: "1:883667275503:web:c34111fdd2e08f2978551a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services
export { auth, firestore, storage };