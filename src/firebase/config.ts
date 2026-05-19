import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUzoWJnSYFDdEWZ8W9805bnp3C913FXc8",
  authDomain: "kalkulatorsederhana-4ef62.firebaseapp.com",
  projectId: "kalkulatorsederhana-4ef62",
  storageBucket: "kalkulatorsederhana-4ef62.firebasestorage.app",
  messagingSenderId: "783351876699",
  appId: "1:783351876699:web:6507d1edd547f5a07b037e"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);

// Use new persistent cache API (replaces deprecated enableIndexedDbPersistence)
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache(),
  });
} catch {
  // If already initialized (e.g. hot reload), just get the existing instance
  db = getFirestore(app);
}

export { app, auth, db };
