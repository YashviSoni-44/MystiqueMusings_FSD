// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqpL1k8olwz2RcxLKeWJWOAG7sh8J0apQ",
  authDomain: "mystiquemusings-450e4.firebaseapp.com",
  projectId: "mystiquemusings-450e4",
  storageBucket: "mystiquemusings-450e4.appspot.com",
  messagingSenderId: "357927786337",
  appId: "1:357927786337:web:161051fd1e9fd645879720"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//google auth
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () =>{
    let user=null;
    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user
    })
    .catch((err) =>{
        console.log(err)
    })
    return user;
}