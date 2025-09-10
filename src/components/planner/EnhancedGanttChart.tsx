import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "date-fns";

interface Task {
  id: string;
  title: string;
  startDate: Date;
  dueDate: Date;
  completed: boolean;
  tags: string[];
  type: "topic" | "custom" | "paper";
  topicId?: string;
  unitId?: string;
}

interface EnhancedGanttChartProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

type ViewMode = "week" | "month";

export const EnhancedGanttChart: React.FC<EnhancedGanttChartProps> = ({
  tasks,
  onTaskUpdate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");

  const { periodStart, periodEnd, periodDays, timeUnit } = useMemo(() => {
    if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push(addDays(weekStart, i));
      }
      return {
        periodStart: weekStart,
        periodEnd: weekEnd,
        periodDays: days,
        timeUnit: 7,
      };
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const days = [];
      const totalDays = differenceInDays(monthEnd, monthStart) + 1;
      for (let i = 0; i < totalDays; i++) {
        days.push(addDays(monthStart, i));
      }
      return {
        periodStart: monthStart,
        periodEnd: monthEnd,
        periodDays: days,
        timeUnit: totalDays,
      };
    }
  }, [currentDate, viewMode]);

  const getTaskPosition = (task: Task) => {
    const taskStart =
      task.startDate > periodStart ? task.startDate : periodStart;
    const taskEnd = task.dueDate < periodEnd ? task.dueDate : periodEnd;

    const startDay = differenceInDays(taskStart, periodStart);
    const duration = differenceInDays(taskEnd, taskStart) + 1;

    return {
      left: `${(startDay / timeUnit) * 100}%`,
      width: `${(duration / timeUnit) * 100}%`,
      visible: taskStart <= periodEnd && taskEnd >= periodStart,
    };
  };

  const getTaskProgress = (task: Task) => {
    if (task.completed) return 100;

    const now = new Date();
    const total = differenceInDays(task.dueDate, task.startDate);
    const elapsed = differenceInDays(now, task.startDate);

    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const navigatePeriod = (direction: "prev" | "next") => {
    if (viewMode === "week") {
      setCurrentDate((prev) => addDays(prev, direction === "next" ? 7 : -7));
    } else {
      setCurrentDate((prev) => addMonths(prev, direction === "next" ? 1 : -1));
    }
  };

  const formatPeriodHeader = () => {
    if (viewMode === "week") {
      return `${format(periodStart, "MMM d")} - ${format(
        periodEnd,
        "MMM d, yyyy"
      )}`;
    } else {
      return format(periodStart, "MMMM yyyy");
    }
  };

  const formatDayHeader = (day: Date) => {
    if (viewMode === "week") {
      return (
        <div key={day.toISOString()} className="text-center font-medium">
          <div>{format(day, "EEE")}</div>
          <div className="text-xs text-muted-foreground">
            {format(day, "d")}
          </div>
        </div>
      );
    } else {
      // For month view, show fewer days to avoid clutter
      const dayNumber = day.getDate();
      if (dayNumber % 3 === 1 || dayNumber === 1) {
        return (
          <div
            key={day.toISOString()}
            className="text-center font-medium text-xs"
          >
            {format(day, "d")}
          </div>
        );
      }
      return <div key={day.toISOString()} className="text-center"></div>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Gantt Chart
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                <Clock className="h-4 w-4 mr-1" />
                Week
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Month
              </Button>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigatePeriod("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {formatPeriodHeader()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigatePeriod("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Header with days */}
        <div
          className={`grid gap-1 mb-4 text-sm ${
            viewMode === "week" ? "grid-cols-8" : "grid-cols-11"
          }`}
        >
          <div className="font-medium">Tasks</div>
          {viewMode === "week"
            ? periodDays.map(formatDayHeader)
            : periodDays
                .filter((_, index) => index % 3 === 0 || index === 0)
                .slice(0, 10)
                .map(formatDayHeader)}
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          {tasks.map((task) => {
            const position = getTaskPosition(task);
            if (!position.visible) return null;

            return (
              <div
                key={task.id}
                className={`grid gap-1 items-center min-h-[60px] ${
                  viewMode === "week" ? "grid-cols-8" : "grid-cols-11"
                }`}
              >
                {/* Task info */}
                <div className="pr-2">
                  <div className="text-sm font-medium truncate">
                    {task.title}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div
                  className={`relative h-8 bg-muted rounded ${
                    viewMode === "week" ? "col-span-7" : "col-span-10"
                  }`}
                >
                  <div
                    className={`absolute h-full rounded transition-all ${
                      task.completed
                        ? "bg-green-500"
                        : task.type === "topic"
                        ? "bg-blue-500"
                        : task.type === "paper"
                        ? "bg-orange-500"
                        : "bg-purple-500"
                    }`}
                    style={{ left: position.left, width: position.width }}
                  >
                    <div className="h-full flex items-center justify-center">
                      <Progress
                        value={getTaskProgress(task)}
                        className="w-full h-2 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Task title overlay */}
                  <div
                    className="absolute inset-0 flex items-center px-2 text-xs font-medium text-white truncate"
                    style={{ left: position.left, width: position.width }}
                  >
                    {viewMode === "week"
                      ? task.title
                      : task.title.substring(0, 20) +
                        (task.title.length > 20 ? "..." : "")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks to display</p>
            <p className="text-sm">Add tasks to see them in the Gantt chart</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
