import React, { useState, useEffect } from "react";
import {
  X,
  Settings,
  Minimize2,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OnScreenTimerProps {
  onClose: () => void;
}

export const OnScreenTimer: React.FC<OnScreenTimerProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [initialTime, setInitialTime] = useState(90 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSetTime = (minutes: number) => {
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Card className="bg-primary text-primary-foreground shadow-lg">
          <CardContent className="p-3 flex items-center gap-3">
            <div
              className="font-mono text-lg font-bold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {formatTime(timeLeft)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80 shadow-xl border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Exam Timer</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {showSettings && (
            <div className="space-y-3 p-3 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Quick Set Timer</Label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetTime(30)}
                >
                  30 min
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetTime(60)}
                >
                  1 hour
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetTime(90)}
                >
                  1.5 hours
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetTime(120)}
                >
                  2 hours
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-time">Custom Time (minutes)</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-time"
                    type="number"
                    placeholder="90"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const value = parseInt(
                          (e.target as HTMLInputElement).value
                        );
                        if (value > 0) handleSetTime(value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <div
              className="text-4xl font-mono font-bold mb-4"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {formatTime(timeLeft)}
            </div>

            {timeLeft === 0 && (
              <div className="text-red-500 font-medium mb-2 animate-pulse">
                Time's Up! ⏰
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2">
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              disabled={timeLeft === 0}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
