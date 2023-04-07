// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth' 

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

// export const signInWithGoogle = () => signInWithPopup(auth, provider) 

export const signInWithGoogle = () =>{
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log(result)
            // const credential = provider.credentialFromResult(result)
            const idToken = result._tokenResponse.idToken
            console.log(idToken)

            const name = result.user.displayName;
            const email = result.user.email;
            const  profilePic = result.user.photoURL;

            localStorage.setItem("name", name)
            localStorage.setItem("email", email)
            localStorage.setItem("profilePic", profilePic)
            // probably bad 
            localStorage.setItem('googleIdToken', idToken)
        })
        .catch((error) => {
            console.log(error)
        })
}