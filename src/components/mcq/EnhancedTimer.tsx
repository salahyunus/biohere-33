import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EnhancedTimerProps {
  duration: number;
  position: "top-right" | "bottom-right" | "floating";
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onTimeUp?: () => void;
}

export const EnhancedTimer: React.FC<EnhancedTimerProps> = ({
  duration,
  position,
  isCollapsed = false,
  onCollapsedChange,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [customDuration, setCustomDuration] = useState(duration);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenTimer, setShowFullscreenTimer] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

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

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customDuration * 60);
  };

  const handleDurationChange = () => {
    setTimeLeft(customDuration * 60);
    setIsRunning(false);
    setShowSettings(false);
  };

  const getProgressPercentage = () => {
    const totalTime = customDuration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "fixed top-4 right-4 z-50";
      case "bottom-right":
        return "fixed bottom-4 right-4 z-50";
      case "floating":
        return "fixed top-1/2 right-4 transform -translate-y-1/2 z-50";
      default:
        return "fixed top-4 right-4 z-50";
    }
  };

  const getStatusColor = () => {
    const percentage = (timeLeft / (customDuration * 60)) * 100;
    if (percentage <= 10) return "text-red-500";
    if (percentage <= 25) return "text-orange-500";
    return "text-green-500";
  };

  if (showFullscreenTimer) {
    return (
      <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className={cn("text-8xl font-bold", getStatusColor())}>
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={isRunning ? handlePause : handleStart} size="lg">
              {isRunning ? (
                <Pause className="h-6 w-6 mr-2" />
              ) : (
                <Play className="h-6 w-6 mr-2" />
              )}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="h-6 w-6 mr-2" />
              Reset
            </Button>
            <Button
              onClick={() => setShowFullscreenTimer(false)}
              variant="outline"
              size="lg"
            >
              <Minimize2 className="h-6 w-6 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <Card className={cn(getPositionClasses(), "w-auto")}>
        <CardContent className="p-3">
          <Button
            variant="ghost"
            onClick={() => onCollapsedChange?.(false)}
            className="flex items-center gap-2 p-2"
          >
            <Clock className="h-4 w-4" />
            <span className={cn("font-mono text-sm", getStatusColor())}>
              {formatTime(timeLeft)}
            </span>
            <ChevronUp className="h-3 w-3" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(getPositionClasses(), "w-64")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timer
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullscreenTimer(true)}
              className="h-6 w-6 p-0"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCollapsedChange?.(true)}
              className="h-6 w-6 p-0"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={cn("text-3xl font-bold font-mono", getStatusColor())}>
            {formatTime(timeLeft)}
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-1000"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={isRunning ? handlePause : handleStart}
            size="sm"
            className="flex-1"
          >
            {isRunning ? (
              <Pause className="h-3 w-3 mr-1" />
            ) : (
              <Play className="h-3 w-3 mr-1" />
            )}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs">
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    min={1}
                    max={300}
                  />
                </div>
                <Button onClick={handleDurationChange} className="w-full">
                  Apply Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {isRunning ? (
              <Badge variant="secondary" className="text-xs">
                Running
              </Badge>
            ) : timeLeft === 0 ? (
              <Badge variant="destructive" className="text-xs">
                Time's Up!
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                Paused
              </Badge>
            )}
          </span>
          <span>{customDuration}m total</span>
        </div>
      </CardContent>
    </Card>
  );
};
