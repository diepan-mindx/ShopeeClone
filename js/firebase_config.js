// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdmY0eZzw0R3yqdliqQHyiplBlvPgduoo",
  authDomain: "jsi35-be345.firebaseapp.com",
  databaseURL: "https://jsi35-be345-default-rtdb.firebaseio.com",
  projectId: "jsi35-be345",
  storageBucket: "jsi35-be345.firebasestorage.app",
  messagingSenderId: "780445617838",
  appId: "1:780445617838:web:c114556667b82f6fb5673f",
  measurementId: "G-FYYF98V50D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);