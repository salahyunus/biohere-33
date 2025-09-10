import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface TimerSettings {
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
}

interface SandTimerProps {
  settings: TimerSettings;
}

export const SandTimer: React.FC<SandTimerProps> = ({ settings }) => {
  const [timeData, setTimeData] = useState({
    totalTime: 0,
    remaining: 0,
    progress: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const examTime = new Date(settings.examDate).getTime();
      const difference = examTime - now;

      // Calculate total time from now to 1 year ago (or exam date creation)
      const yearAgo = now - 365 * 24 * 60 * 60 * 1000;
      const totalTime = examTime - yearAgo;

      const remaining = Math.max(0, difference);
      const progress =
        remaining > 0 ? ((totalTime - remaining) / totalTime) * 100 : 100;

      setTimeData({ totalTime, remaining, progress });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [settings.examDate]);

  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] rounded-xl p-8"
      style={{
        backgroundColor: settings.backgroundColor,
        color: settings.fontColor,
        fontFamily: settings.fontFamily,
      }}
    >
      <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
        IAL Biology U4 Exam Countdown
      </h2>

      <div className="relative w-64 h-96 mx-auto mb-8">
        {/* Sand Timer SVG */}
        <svg viewBox="0 0 200 300" className="w-full h-full">
          {/* Timer outline */}
          <path
            d="M40 20 L160 20 L160 50 L100 120 L160 190 L160 270 L40 270 L40 190 L100 120 L40 50 Z"
            fill="none"
            stroke={settings.fontColor}
            strokeWidth="3"
          />

          {/* Top sand */}
          <path
            d="M45 25 L155 25 L155 45 L100 115 L45 45 Z"
            fill={settings.fontColor}
            opacity={0.3}
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% ${
                100 - timeData.progress
              }%, 0 ${100 - timeData.progress}%)`,
            }}
          />

          {/* Bottom sand */}
          <path
            d="M45 195 L100 125 L155 195 L155 265 L45 265 Z"
            fill={settings.fontColor}
            opacity={0.6}
            style={{
              clipPath: `polygon(0 ${100 - timeData.progress}%, 100% ${
                100 - timeData.progress
              }%, 100% 100%, 0 100%)`,
            }}
          />

          {/* Sand stream */}
          {timeData.remaining > 0 && (
            <line
              x1="100"
              y1="120"
              x2="100"
              y2="125"
              stroke={settings.fontColor}
              strokeWidth="2"
              opacity={0.8}
            />
          )}
        </svg>
      </div>

      <div className="text-center">
        <p className="text-lg md:text-xl font-semibold mb-2">
          {timeData.remaining > 0
            ? formatTime(timeData.remaining)
            : "Exam Day!"}
        </p>
        <p className="text-sm opacity-70">
          {timeData.remaining > 0 ? "until exam" : "Good luck!"}
        </p>
      </div>

      {settings.showProgressBar && (
        <div className="w-full max-w-md mt-6">
          <Progress value={timeData.progress} className="h-2" />
          <p className="text-center text-xs mt-2 opacity-60">
            {Math.round(timeData.progress)}% complete
          </p>
        </div>
      )}
    </div>
  );
};
