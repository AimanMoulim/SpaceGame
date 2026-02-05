import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDWazdrT2xlWAwvoL7tXPoJ_GHgtbQV90M",
  authDomain: "project-76ec8.firebaseapp.com",
  databaseURL: "https://project-76ec8-default-rtdb.firebaseio.com",
  projectId: "project-76ec8",
  storageBucket: "project-76ec8.firebasestorage.app",
  messagingSenderId: "941225897802",
  appId: "1:941225897802:web:e381a8e2df11c2c2955bb3",
  measurementId: "G-Y1VMCN0781"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app)

export default app
