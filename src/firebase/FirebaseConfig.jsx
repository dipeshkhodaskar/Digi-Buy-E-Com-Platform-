// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-RkqRvrxfjHARV8bZ7idZISVnT_CyCQM",
  authDomain: "e-comerse-site-20905.firebaseapp.com",
  projectId: "e-comerse-site-20905",
  storageBucket: "e-comerse-site-20905.firebasestorage.app",
  messagingSenderId: "235958675893",
  appId: "1:235958675893:web:bd7862f26a0e5290af51fc",
  measurementId: "G-8XVH45R29D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const fireDB= getFirestore(app);
const auth= getAuth(app);
 
export {fireDB, auth, analytics, app}