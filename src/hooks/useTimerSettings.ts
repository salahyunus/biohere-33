import { useState, useEffect } from "react";

export interface TimerSettings {
  examDate: Date;
  backgroundColor: string;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  showMonths: boolean;
  showProgressBar: boolean;
  timerStyle: "digital" | "sand";
  isFullscreen: boolean;
  showExamTime: boolean;
  customizable: boolean;
  borderRadius: number;
  shadowIntensity: number;
  letterSpacing: number;
}

const defaultSettings: TimerSettings = {
  examDate: new Date("2025-06-15"),
  backgroundColor: "hsl(var(--background))",
  fontColor: "hsl(var(--foreground))",
  fontFamily: "Sora",
  fontSize: 64,
  showDays: true,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  showMonths: false,
  showProgressBar: false,
  timerStyle: "digital",
  isFullscreen: false,
  showExamTime: false,
  customizable: true,
  borderRadius: 8,
  shadowIntensity: 0.1,
  letterSpacing: 0,
};

export const useTimerSettings = () => {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem("timerSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.examDate) {
          parsed.examDate = new Date(parsed.examDate);
        }
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Failed to parse timer settings:", error);
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      const toSave = {
        ...updated,
        examDate: updated.examDate.toISOString(),
      };
      localStorage.setItem("timerSettings", JSON.stringify(toSave));
      return updated;
    });
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    localStorage.setItem(
      "timerSettings",
      JSON.stringify({
        ...defaultSettings,
        examDate: defaultSettings.examDate.toISOString(),
      })
    );
  };

  return {
    settings,
    updateSettings,
    resetToDefaults,
  };
};
