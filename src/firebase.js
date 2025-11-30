// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDt2BKr6BnVSQ8T1NzyY8pVTjy24MKJmvE",
    authDomain: "zylitharr.firebaseapp.com",
    projectId: "zylitharr",
    storageBucket: "zylitharr.firebasestorage.app",
    messagingSenderId: "659611788594",
    appId: "1:659611788594:web:e1009e36484a2b1661e32b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app