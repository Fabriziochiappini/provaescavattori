import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBi2doWOmH9UtxyMknZQPvFEouRZzxkeuE",
    authDomain: "contegroup-7f176.firebaseapp.com",
    projectId: "contegroup-7f176",
    storageBucket: "contegroup-7f176.firebasestorage.app",
    messagingSenderId: "862122795080",
    appId: "1:862122795080:web:ae398ecdb11c328170f87d",
    measurementId: "G-5EHHGY1FKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth };
