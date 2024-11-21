// firebaseConfig.js - Firebase Configuration and Access
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC8ozzZWChu-ixu9FjwN5_ZVlXNt-m-yc0",
  authDomain: "crop-diagnosis-detector.firebaseapp.com",
  projectId: "crop-diagnosis-detector",
  storageBucket: "crop-diagnosis-detector.appspot.com",
  messagingSenderId: "97767782149",
  appId: "1:97767782149:web:5912418b43934e05c0a96c"
};
  

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const app = initializeApp(firebaseConfig);

export {app, firebase}