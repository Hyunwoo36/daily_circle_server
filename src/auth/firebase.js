import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import admin from 'firebase-admin';

const firebaseConfig = {
    apiKey: process.env.FB_APIKEY,
    authDomain: process.env.FB_AUTHDOMAIN,
    projectId: process.env.FB_PROJECTID,
    storageBucket: process.env.FB_STORAGEBUCKET,
    messagingSenderId: process.env.FB_MESSAGINGSENDERID,
    appId: process.env.FB_APPID,
    measurementId: process.env.FB_MEASUREMENTID
};


admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.FB_ADMIN_TYPE,
        project_id: process.env.FB_ADMIN_PROJECTID,
        private_key_id: process.env.FB_ADMIN_PK_ID,
        private_key: process.env.FB_ADMIN_PK_KEY.replace(/\\n/g, '\n'), // Correctly format newlines,
        client_email: process.env.FB_ADMIN_CLIENTEMAIL,
        client_id: process.env.FB_ADMIN_CLIENTID,
        auth_uri: process.env.FB_ADMIN_AUTH_URL,
        token_uri: process.env.FB_ADMIN_AUTH_TOK,
        auth_provider_x509_cert_url: process.env.FB_ADMIN_AUTH_PROVIDER_URL,
        client_x509_cert_url: process.env.FB_ADMIN_CLIENT_CERT_URL,
    })
});


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, admin }