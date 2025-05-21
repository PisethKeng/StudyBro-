// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp} from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from "firebase/analytics";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXKowoLIjVcyOGxcIfimlBM1OTlKZ6P0M",
  authDomain: "studymate-773e6.firebaseapp.com",
  projectId: "studymate-773e6",
  storageBucket: "studymate-773e6.firebasestorage.app",
  messagingSenderId: "1014513061759",
  appId: "1:1014513061759:web:34ca3400d2d49e2ac9144a",
  measurementId: "G-VJ1FXD7K2T"
};

// Initialize Firebase App (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Conditionally initialize Analytics only on the client side
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// vertex AI 

export const vertexAI = getVertexAI(app);

export const model = getGenerativeModel(vertexAI, { model: "gemini-2.0-flash" });


export default app;