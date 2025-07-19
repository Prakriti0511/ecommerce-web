import {getAuth} from "firebase/auth"
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginauth-1081c.firebaseapp.com",
  projectId: "loginauth-1081c",
  storageBucket: "loginauth-1081c.firebasestorage.app",
  messagingSenderId: "264218913494",
  appId: "1:264218913494:web:ae459dfdadef8ae2b2f777"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider}