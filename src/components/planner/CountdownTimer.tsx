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

interface CountdownTimerProps {
  settings: TimerSettings;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ settings }) => {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  const [progressData, setProgressData] = useState({
    progress: 0,
    startDate: new Date(),
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const examTime = new Date(settings.examDate).getTime();
      const difference = examTime - now;

      if (difference > 0) {
        let totalSeconds = Math.floor(difference / 1000);

        // Calculate base units
        const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
        let remainingAfterMonths = difference % (1000 * 60 * 60 * 24 * 30);

        let days = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24));
        let remainingAfterDays = remainingAfterMonths % (1000 * 60 * 60 * 24);

        let hours = Math.floor(remainingAfterDays / (1000 * 60 * 60));
        let remainingAfterHours = remainingAfterDays % (1000 * 60 * 60);

        let minutes = Math.floor(remainingAfterHours / (1000 * 60));
        let seconds = Math.floor((remainingAfterHours % (1000 * 60)) / 1000);

        // Convert units when toggled off
        if (!settings.showMonths && months > 0) {
          days += months * 30;
        }

        if (!settings.showDays && days > 0) {
          hours += days * 24;
        }

        if (!settings.showHours && hours > 0) {
          minutes += hours * 60;
        }

        if (!settings.showMinutes && minutes > 0) {
          seconds += minutes * 60;
        }

        setTimeLeft({
          months: settings.showMonths ? months : 0,
          days: settings.showDays ? days : 0,
          hours: settings.showHours ? hours : 0,
          minutes: settings.showMinutes ? minutes : 0,
          seconds: settings.showSeconds ? seconds : 0,
          totalSeconds,
        });

        // Calculate progress for progress bar
        const yearAgo = now - 365 * 24 * 60 * 60 * 1000;
        const totalTime = examTime - yearAgo;
        const progress = ((totalTime - difference) / totalTime) * 100;

        setProgressData({
          progress: Math.min(100, Math.max(0, progress)),
          startDate: new Date(yearAgo),
        });
      } else {
        setTimeLeft({
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
        });
        setProgressData({ progress: 100, startDate: new Date() });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [
    settings.examDate,
    settings.showDays,
    settings.showHours,
    settings.showMinutes,
    settings.showSeconds,
    settings.showMonths,
  ]);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  const timeUnits = [];

  if (settings.showMonths && timeLeft.months > 0) {
    timeUnits.push({ value: timeLeft.months, label: "Months" });
  }
  if (settings.showDays && timeLeft.days > 0) {
    timeUnits.push({ value: timeLeft.days, label: "Days" });
  }
  if (settings.showHours && timeLeft.hours > 0) {
    timeUnits.push({ value: timeLeft.hours, label: "Hours" });
  }
  if (settings.showMinutes && timeLeft.minutes > 0) {
    timeUnits.push({ value: timeLeft.minutes, label: "Minutes" });
  }
  if (settings.showSeconds && timeLeft.seconds > 0) {
    timeUnits.push({ value: timeLeft.seconds, label: "Seconds" });
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] rounded-xl p-8 transition-all duration-300"
      style={{
        backgroundColor: settings.backgroundColor,
        color: settings.fontColor,
        fontFamily: settings.fontFamily,
      }}
    >
      <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
        IAL Biology U4 Exam Countdown
      </h2>

      {settings.showProgressBar && (
        <div className="w-full max-w-2xl mb-8">
          <Progress value={progressData.progress} className="h-3 mb-2" />
          <p className="text-center text-sm opacity-70">
            Progress: {Math.round(progressData.progress)}% complete
          </p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div
              className="bg-black/10 rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[120px] text-center"
              style={{ fontSize: `${settings.fontSize}px` }}
            >
              <span className="font-bold">{formatNumber(unit.value)}</span>
            </div>
            <p className="mt-2 text-sm md:text-base opacity-80 font-medium">
              {unit.label}
            </p>
          </div>
        ))}
      </div>

      {timeUnits.length === 0 && (
        <div className="text-center">
          <p className="text-xl md:text-2xl font-semibold">Exam Day!</p>
          <p className="text-sm md:text-base opacity-80 mt-2">
            Good luck with your exam!
          </p>
        </div>
      )}
    </div>
  );
};
