import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCum2pcZBBtipiW-S3IgcN-WryN5d7gdhg",
  authDomain: "kelas1-39a72.firebaseapp.com",
  projectId: "kelas1-39a72",
  storageBucket: "kelas1-39a72.firebasestorage.app",
  messagingSenderId: "659108925081",
  appId: "1:659108925081:web:43ef0caafb8a071b62b208",
  measurementId: "G-TKJ98613W6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
