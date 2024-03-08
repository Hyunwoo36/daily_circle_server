import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import admin1 from 'firebase-admin';

// const serviceAccountPath = '/dailycircle-f157e-firebase-adminsdk-20g6s-8281a94c5c.json';
// import(serviceAccountPath)

// import serviceAccount from '/dailycircle-f157e-firebase-adminsdk-20g6s-8281a94c5c.json';


const firebaseConfig = {
    apiKey: process.env.FB_APIKEY,
    authDomain: process.env.FB_AUTHDOMAIN,
    projectId: process.env.FB_PROJECTID,
    storageBucket: process.env.FB_STORAGEBUCKET,
    messagingSenderId: process.env.FB_MESSAGINGSENDERID,
    appId: process.env.FB_APPID,
    measurementId: process.env.FB_MEASUREMENTID
};

const admin = admin1;

const serviceAccountPath = './dailycircle-f157e-firebase-adminsdk-20g6s-8281a94c5c.json';
import(serviceAccountPath, { assert: { type: 'json' } })
    .then(serviceAccount => {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount.default)
        });
    })
    .catch(error => console.error("Failed to load service account JSON", error));


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, admin }