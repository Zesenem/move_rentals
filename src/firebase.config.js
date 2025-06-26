import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 


const firebaseConfig = {
  apiKey: "AIzaSyAt6PKXRFE02b3u41g00RRh5-WCNZfO47w",
  authDomain: "move-rentals.firebaseapp.com",
  projectId: "move-rentals",
  storageBucket: "move-rentals.firebasestorage.app",
  messagingSenderId: "143149388725",
  appId: "1:143149388725:web:2b0c744bd4d47b453d3ffc",
  measurementId: "G-19W5G93PBC"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);