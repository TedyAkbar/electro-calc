"use client";

import React, { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Settings as SettingsIcon, LogOut, LogIn, Moon, Sun, Save, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { auth } from "@/firebase/config";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useState } from "react";
import { useSettings, playClickSound } from "@/hooks/useSettings";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all duration-300 relative focus:outline-none ${enabled ? "bg-cyan-500 shadow-lg shadow-cyan-500/30" : "bg-gray-600"}`}
      role="switch"
      aria-checked={enabled}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${enabled ? "left-7" : "left-1"}`} />
    </button>
  );
}

export default function Settings() {
  const { settings, updateSetting } = useSettings();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (settings.soundEnabled) playClickSound();
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    if (settings.soundEnabled) playClickSound();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleToggle = (key: "darkMode" | "saveHistory" | "soundEnabled") => {
    if (settings.soundEnabled) playClickSound();
    updateSetting(key, !settings[key]);
  };

  const prefItems = [
    {
      key: "darkMode" as const,
      icon: settings.darkMode ? Moon : Sun,
      iconColor: settings.darkMode ? "text-indigo-400" : "text-yellow-400",
      label: "Dark Mode",
      desc: "Toggle application theme",
    },
    {
      key: "saveHistory" as const,
      icon: Save,
      iconColor: "text-green-400",
      label: "Save History",
      desc: "Keep track of calculations",
    },
    {
      key: "soundEnabled" as const,
      icon: Volume2,
      iconColor: "text-blue-400",
      label: "Button Sounds",
      desc: "Play sound on click",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-teal-500/10 rounded-xl text-teal-500">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Account */}
      <Card className="mb-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-white">Account</h2>
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full ring-2 ring-cyan-500/50" />
              ) : (
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <p className="font-medium text-white">{user.displayName || "User"}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
                <p className="text-[10px] text-green-400 mt-0.5">✓ History synced to cloud</p>
              </div>
            </div>
            <Button variant="danger" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Login untuk sinkronisasi riwayat ke semua perangkat.</p>
            <Button variant="primary" className="w-full" onClick={handleLogin}>
              <LogIn className="w-5 h-5 mr-2" /> Login with Google
            </Button>
          </div>
        )}
      </Card>

      {/* Preferences */}
      <Card className="space-y-6 border border-gray-800">
        <h2 className="text-lg font-semibold text-white">Preferences</h2>

        {prefItems.map(({ key, icon: Icon, iconColor, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div>
                <p className="font-medium text-white">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </div>
            <Toggle enabled={settings[key]} onToggle={() => handleToggle(key)} />
          </div>
        ))}
      </Card>

      {/* Status indicators */}
      <div className="flex flex-col gap-2 text-xs">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${settings.darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-yellow-500/10 text-yellow-400"}`}>
          <span>{settings.darkMode ? "🌙" : "☀️"}</span>
          <span>{settings.darkMode ? "Dark Mode aktif" : "Light Mode aktif"}</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${settings.saveHistory ? "bg-green-500/10 text-green-400" : "bg-gray-800 text-gray-500"}`}>
          <span>{settings.saveHistory ? "✓" : "✗"}</span>
          <span>{settings.saveHistory ? "Riwayat perhitungan diaktifkan" : "Riwayat perhitungan dinonaktifkan"}</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${settings.soundEnabled ? "bg-blue-500/10 text-blue-400" : "bg-gray-800 text-gray-500"}`}>
          <span>{settings.soundEnabled ? "🔊" : "🔇"}</span>
          <span>{settings.soundEnabled ? "Suara tombol aktif" : "Suara tombol nonaktif"}</span>
        </div>
      </div>

      <div className="text-center text-xs text-gray-600 mt-4 pb-4">
        <p>ElectroCalc v1.0.0</p>
        <p>Developed for Engineering Students</p>
      </div>
    </div>
  );
}
