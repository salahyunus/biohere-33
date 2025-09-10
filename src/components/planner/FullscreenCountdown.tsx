import React, { useState, useEffect } from "react";
import { X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./CountdownTimer";

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

interface FullscreenCountdownProps {
  settings: TimerSettings;
  onExitFullscreen: () => void;
}

export const FullscreenCountdown: React.FC<FullscreenCountdownProps> = ({
  settings,
  onExitFullscreen,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExitFullscreen();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onExitFullscreen]);

  const handleMouseMove = () => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  };

  return (
    <div
      className="fixed inset-0 z-50 cursor-none"
      onMouseMove={handleMouseMove}
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div
        className={`absolute top-4 right-4 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onExitFullscreen}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="h-full flex items-center justify-center">
        <CountdownTimer settings={settings} />
      </div>

      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-white/60 text-sm">Press ESC to exit fullscreen</p>
      </div>
    </div>
  );
};
