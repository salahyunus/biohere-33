import React, { useState } from "react";
import { Settings, Clock, Calendar, Maximize2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullscreenCountdown } from "@/components/planner/FullScreenCountdown";
import { CountdownTimer } from "@/components/planner/CountdownTimer";
import { SandTimer } from "@/components/planner/SandTimer";
import { TimerSettings } from "@/components/planner/TimerSettings";
import { GanttChart } from "@/components/planner/GanttChart";
import { EnhancedGanttChart } from "@/components/planner/EnhancedGanttChart";
import { CalendarView } from "@/components/planner/CalendarView";
import { useTimerSettings } from "@/hooks/useTimerSettings";
import { usePlannerData } from "@/hooks/usePlannerData";

const Planner: React.FC = () => {
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const timerSettings = useTimerSettings();
  const plannerData = usePlannerData();

  const handleFullscreen = () => {
    timerSettings.updateSettings({ isFullscreen: true });
  };

  const handleExitFullscreen = () => {
    timerSettings.updateSettings({ isFullscreen: false });
  };

  if (timerSettings.settings.isFullscreen) {
    return (
      <FullscreenCountdown
        settings={timerSettings.settings}
        onExitFullscreen={handleExitFullscreen}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Exam Planner & Timer</h1>
          <p className="text-muted-foreground">
            Plan your study schedule and track time to your IAL Biology U4 exam
          </p>
        </div>

        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="gantt" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Gantt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="mt-0">
            <div className="relative">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFullscreen}
                  title="Fullscreen"
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTimerSettings(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>

              {timerSettings.settings.timerStyle === "digital" ? (
                <CountdownTimer settings={timerSettings.settings} />
              ) : (
                <SandTimer settings={timerSettings.settings} />
              )}

              <TimerSettings
                open={showTimerSettings}
                onOpenChange={setShowTimerSettings}
                settings={timerSettings.settings}
                updateSettings={timerSettings.updateSettings}
              />
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <CalendarView
              tasks={plannerData.tasks}
              onTaskClick={(task) => {
                console.log("Task clicked:", task);
              }}
            />
          </TabsContent>

          <TabsContent value="planner" className="mt-0">
            <GanttChart {...plannerData} />
          </TabsContent>

          <TabsContent value="gantt" className="mt-0">
            <EnhancedGanttChart
              tasks={plannerData.tasks}
              onTaskUpdate={plannerData.updateTask}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Planner;
