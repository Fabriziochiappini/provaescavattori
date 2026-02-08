import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCREi6jeviipZwSod6-q7CAgPhi8W7ZAQM",
    authDomain: "civico26.firebaseapp.com",
    projectId: "civico26",
    storageBucket: "civico26.firebasestorage.app",
    messagingSenderId: "808903891699",
    appId: "1:808903891699:web:8cacda308e0e2dca61f586",
    measurementId: "G-BGVF435BZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth };
