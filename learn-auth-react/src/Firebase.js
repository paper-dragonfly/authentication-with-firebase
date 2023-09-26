// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth' 
import 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-_0hnggZritMVJFXxmLrax5j6MZQu3V0",
  authDomain: "learn-auth-0423.firebaseapp.com",
  projectId: "learn-auth-0423",
  storageBucket: "learn-auth-0423.appspot.com",
  messagingSenderId: "1042728075855",
  appId: "1:1042728075855:web:58440733c2495bf192603a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

//gmail
const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => signInWithPopup(auth, provider) 

export const firebaseSignOut =  () => signOut(auth)


