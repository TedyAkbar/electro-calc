import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/config";
import { collection, getDocs, query, orderBy, limit, deleteDoc, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export interface HistoryItem {
  id: string;
  type: string;
  formula: string;
  result: string;
  createdAt: number;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initial load from local storage
    const saved = localStorage.getItem("electrocalc_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }

    // Listen to auth changes and fetch from Firebase if logged in
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const q = query(collection(db, "users", currentUser.uid, "history"), orderBy("createdAt", "desc"), limit(50));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const firebaseHistory = querySnapshot.docs.map((doc) => doc.data() as HistoryItem);
            setHistory(firebaseHistory);
            localStorage.setItem("electrocalc_history", JSON.stringify(firebaseHistory));
          }
        } catch (error) {
          console.error("Error fetching history from Firebase:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const addHistory = async (item: Omit<HistoryItem, "id" | "createdAt">) => {
    // Check saveHistory preference
    try {
      const savedSettings = localStorage.getItem("electrocalc_settings");
      if (savedSettings) {
        const { saveHistory } = JSON.parse(savedSettings);
        if (saveHistory === false) return;
      }
    } catch { /* ignore */ }

    const newItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    
    // Update local state and storage
    setHistory((prev) => {
      const newHistory = [newItem, ...prev].slice(0, 50); // Keep last 50
      localStorage.setItem("electrocalc_history", JSON.stringify(newHistory));
      return newHistory;
    });

    // Sync to Firebase if logged in
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid, "history", newItem.id), newItem);
      } catch (error) {
        console.error("Error saving to Firebase:", error);
      }
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    localStorage.removeItem("electrocalc_history");

    if (user) {
      try {
        const q = query(collection(db, "users", user.uid, "history"));
        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map((document) => 
          deleteDoc(doc(db, "users", user.uid, "history", document.id))
        );
        await Promise.all(deletePromises);
      } catch (error) {
        console.error("Error clearing Firebase history:", error);
      }
    }
  };

  return { history, addHistory, clearHistory };
}
