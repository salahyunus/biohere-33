import { useState, useEffect } from "react";

interface TaskTimeSettings {
  [taskId: string]: {
    showStartTime: boolean;
    showDueTime: boolean;
  };
}

export const useTaskTimeSettings = () => {
  const [settings, setSettings] = useState<TaskTimeSettings>({});

  useEffect(() => {
    const saved = localStorage.getItem("taskTimeSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (error) {
        console.error("Failed to parse task time settings:", error);
        setSettings({});
      }
    }
  }, []);

  const updateTaskTimeSetting = (
    taskId: string,
    updates: Partial<{ showStartTime: boolean; showDueTime: boolean }>
  ) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        [taskId]: {
          showStartTime: prev[taskId]?.showStartTime || false,
          showDueTime: prev[taskId]?.showDueTime || false,
          ...updates,
        },
      };
      localStorage.setItem("taskTimeSettings", JSON.stringify(updated));
      return updated;
    });
  };

  const getTaskTimeSetting = (taskId: string) => {
    return settings[taskId] || { showStartTime: false, showDueTime: false };
  };

  return {
    updateTaskTimeSetting,
    getTaskTimeSetting,
  };
};
