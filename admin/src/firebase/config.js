// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCZwlkYhqEZrP-7fZi7yj4iEgwzAh9Ve5Y",
  authDomain: "hddev-e5f44.firebaseapp.com",
  projectId: "hddev-e5f44",
  storageBucket: "hddev-e5f44.appspot.com",
  messagingSenderId: "680210495480",
  appId: "1:680210495480:web:5ebfbfb5b8f6b69d8ec80d",
  measurementId: "G-FM85ZVDM8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);