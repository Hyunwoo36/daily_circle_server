import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBXE1JJrnUeE8HdVTo8Kgj9U2h-go58HN8",
    authDomain: "dailycircle-f157e.firebaseapp.com",
    projectId: "dailycircle-f157e",
    storageBucket: "dailycircle-f157e.appspot.com",
    messagingSenderId: "673993805261",
    appId: "1:673993805261:web:dbf7cfc8c11da6f26b4884",
    measurementId: "G-P7Q1E95TXB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth }