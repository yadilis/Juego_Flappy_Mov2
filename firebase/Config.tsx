import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCLh7tkLMbh3loaWk6oOD2lH-uhQoXkRSE",
  authDomain: "proyecto1-9780f.firebaseapp.com",
  databaseURL: "https://proyecto1-9780f-default-rtdb.firebaseio.com",
  projectId: "proyecto1-9780f",
  storageBucket: "proyecto1-9780f.firebasestorage.app",
  messagingSenderId: "269289670194",
  appId: "1:269289670194:web:fd57c490bac5301c9b5e2b",
  measurementId: "G-R3XCZTLK7F"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getDatabase(app);
