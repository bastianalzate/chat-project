import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup  } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Auth and GoogleAuthProvider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Query for messages
const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "asc"));

export { db, auth, provider, messagesQuery, signInWithPopup };
