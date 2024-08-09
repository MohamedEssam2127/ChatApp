// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz4Q5YhA8kGCvn03ut7ni0wRxmVQxHCLg",
  authDomain: "chat1-9ce9a.firebaseapp.com",
  projectId: "chat1-9ce9a",
  storageBucket: "chat1-9ce9a.appspot.com",
  messagingSenderId: "1052290258048",
  appId: "1:1052290258048:web:cfb0d09296401bd8760265",
  measurementId: "G-6H0BR72RP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export { app, db, auth };
