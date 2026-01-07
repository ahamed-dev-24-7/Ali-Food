// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ali-food-b1b5d.firebaseapp.com",
  projectId: "ali-food-b1b5d",
  storageBucket: "ali-food-b1b5d.firebasestorage.app",
  messagingSenderId: "430227948325",
  appId: "1:430227948325:web:7dc4de4255415009c150cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app);

export {app, auth};