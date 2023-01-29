// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// export const firebaseConfig = {
//   apiKey: import.meta.env.VUE_APP_apiKey,
//   authDomain: import.meta.env.VUE_APP_authDomain,
//   projectId: import.meta.env.VUE_APP_projectId,
//   storageBucket: import.meta.env.VUE_APP_storageBucket,
//   messagingSenderId: import.meta.env.VUE_APP_messagingSenderId,
//   appId: import.meta.env.VUE_APP_appId,
// }

const firebaseConfig = {
  apiKey: 'AIzaSyAD3693TnP9G3j_CBb9laNYj5qvtzY6Djs',
  authDomain: 'snake-32d0b.firebaseapp.com',
  projectId: 'snake-32d0b',
  storageBucket: 'snake-32d0b.appspot.com',
  messagingSenderId: '887171963895',
  appId: '1:887171963895:web:9a66b0c2bbd527ecc7acf2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
