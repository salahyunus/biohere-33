import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Pause,
  Play,
  RotateCcw,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DraggableTimerProps {
  duration: number; // in minutes
  onTimeUp?: () => void;
  className?: string;
}

export const DraggableTimer: React.FC<DraggableTimerProps> = ({
  duration,
  onTimeUp,
  className,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 320,
    y: 20,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const timerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timerRef.current) return;

    const rect = timerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = Math.max(
      0,
      Math.min(window.innerWidth - 300, e.clientX - dragOffset.x)
    );
    const newY = Math.max(
      0,
      Math.min(window.innerHeight - 100, e.clientY - dragOffset.y)
    );

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / (duration * 60)) * 100;
    if (percentage <= 10) return "text-red-500";
    if (percentage <= 25) return "text-orange-500";
    return "text-foreground";
  };

  return (
    <Card
      ref={timerRef}
      className={cn(
        "fixed z-50 shadow-xl border-2 transition-all duration-200 cursor-move select-none",
        isCollapsed ? "w-32" : "w-72",
        timeLeft <= 60 && timeLeft > 0
          ? "animate-pulse border-red-500"
          : "border-border",
        className
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="p-3">
        {isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className={cn("font-mono text-sm font-bold", getTimeColor())}>
              {formatTime(timeLeft)}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(false);
              }}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Exam Timer</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(true);
                }}
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-center">
              <div
                className={cn("text-3xl font-mono font-bold", getTimeColor())}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.ceil(timeLeft / 60)} minutes remaining
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTimer();
                }}
              >
                {isRunning ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  resetTimer();
                }}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>

            {timeLeft === 0 && (
              <div className="text-center text-red-500 font-medium animate-pulse">
                Time's Up!
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
