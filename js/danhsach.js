import { initializeApp } from "firebase/app";
import { getFirestore } from "https://console.firebase.google.com/u/0/project/jsi35-be345/firestore/databases/-default-/data/~2Fodera~2FvGipMMznWiBHtHzkwggc?view=panel-view&query=1%7CLIM%7C3%2F100&scopeType=collection&scopeName=%2Fodera";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    FIREBASE_CONFIGURATION
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);