import { useState, useEffect } from "react";

export interface NotesSettings {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  highlightColor: string;
  textSelectionPopover: boolean;
}

const SETTINGS_KEY = "notes-settings";

const defaultSettings: NotesSettings = {
  fontSize: 16,
  fontFamily: "Sora",
  textColor: "hsl(var(--foreground))",
  highlightColor: "#fef08a",
  textSelectionPopover: true,
};

export const useNotesSettings = () => {
  const [settings, setSettings] = useState<NotesSettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load notes settings:", e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<NotesSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  return {
    settings,
    updateSettings,
  };
};
