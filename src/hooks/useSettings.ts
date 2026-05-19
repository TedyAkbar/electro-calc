import { useState, useEffect } from "react";

export interface AppSettings {
  darkMode: boolean;
  saveHistory: boolean;
  soundEnabled: boolean;
}

const SETTINGS_KEY = "electrocalc_settings";

const defaultSettings: AppSettings = {
  darkMode: true,
  saveHistory: true,
  soundEnabled: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppSettings;
        setSettings(parsed);
        applyDarkMode(parsed.darkMode);
      } catch {
        // ignore
      }
    }
  }, []);

  const applyDarkMode = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));

    if (key === "darkMode") {
      applyDarkMode(value as boolean);
    }
  };

  return { settings, updateSetting };
}

/** Play a soft UI click using Web Audio API */
export function playClickSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Browser doesn't support Web Audio API
  }
}
