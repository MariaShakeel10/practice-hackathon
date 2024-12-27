// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  deleteUser,
  updateEmail,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  Timestamp,
  collection,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  orderBy,
  query,
  where,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAedpoDotVQf2B7L5wQqikSMUbyLQsf8Ns",
  authDomain: "practice-748a5.firebaseapp.com",
  databaseURL: "https://practice-748a5-default-rtdb.firebaseio.com",
  projectId: "practice-748a5",
  storageBucket: "practice-748a5.firebasestorage.app",
  messagingSenderId: "743121824537",
  appId: "1:743121824537:web:61eeecaba5519608123388"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();

// Exporting modules
export {
  app,
  auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  deleteUser,
  fetchSignInMethodsForEmail,
  updateProfile,
  updateEmail,
  db,
  getFirestore,
  doc,
  setDoc,
  Timestamp,
  collection,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  orderBy,
  query,
  where,
  getDoc,
  updateDoc,
  storage,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  provider,
  deleteDoc,
  getDocs,
};




export const addPost = async (title, content) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      title: title,
      content: content,
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};