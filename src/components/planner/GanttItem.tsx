import React, { useState } from "react";
import {
  Calendar,
  Tag,
  AlertTriangle,
  Trash2,
  Edit,
  Check,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  format,
  isAfter,
  startOfDay,
  differenceInDays,
  differenceInMilliseconds,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useTaskTimeSettings } from "@/hooks/useTaskTimeSettings";

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

interface GanttItemProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onRemove: () => void;
}

export const GanttItem: React.FC<GanttItemProps> = ({
  task,
  onUpdate,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [newTag, setNewTag] = useState("");

  const { updateTaskTimeSetting, getTaskTimeSetting } = useTaskTimeSettings();
  const timeSettings = getTaskTimeSetting(task.id);
  const showStartTime = timeSettings.showStartTime;
  const showDueTime = timeSettings.showDueTime;

  const today = new Date();
  const taskStartDate = task.startDate;
  const taskDueDate = task.dueDate;
  const isOverdue = !task.completed && isAfter(today, taskDueDate);
  const hasStarted =
    isAfter(today, taskStartDate) ||
    today.getTime() === taskStartDate.getTime();
  const daysUntilDue = differenceInDays(taskDueDate, startOfDay(today));

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate({ title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !task.tags.includes(newTag.trim())) {
      onUpdate({ tags: [...task.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ tags: task.tags.filter((tag) => tag !== tagToRemove) });
  };

  // Calculate remaining time progress using the specified formula
  const getRemainingTimeProgress = () => {
    if (task.completed) return 0;
    if (!hasStarted) return null; // Don't show progress bar if task hasn't started

    const totalDuration = differenceInMilliseconds(
      task.dueDate,
      task.startDate
    );
    const remainingTime = differenceInMilliseconds(task.dueDate, today);

    if (remainingTime <= 0) return 0; // Overdue
    if (totalDuration <= 0) return 100; // Invalid duration

    const progress = Math.max(
      0,
      Math.min(100, (remainingTime / totalDuration) * 100)
    );
    return progress;
  };

  const remainingProgress = getRemainingTimeProgress();

  const handleDateTimeUpdate = (
    date: Date | undefined,
    isStartDate: boolean,
    showTime: boolean
  ) => {
    if (!date) return;

    const currentDate = isStartDate ? task.startDate : task.dueDate;
    let newDate: Date;

    if (showTime) {
      // Keep the existing time
      newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes()
      );
    } else {
      // Set time to midnight
      newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0
      );
    }

    if (isStartDate) {
      onUpdate({ startDate: newDate });
    } else {
      onUpdate({ dueDate: newDate });
    }
  };

  const handleTimeUpdate = (
    hours: number,
    minutes: number,
    isStartDate: boolean
  ) => {
    const currentDate = isStartDate ? task.startDate : task.dueDate;
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes
    );

    if (isStartDate) {
      onUpdate({ startDate: newDate });
    } else {
      onUpdate({ dueDate: newDate });
    }
  };

  const handleShowTimeToggle = (checked: boolean, isStartDate: boolean) => {
    if (isStartDate) {
      updateTaskTimeSetting(task.id, { showStartTime: checked });
    } else {
      updateTaskTimeSetting(task.id, { showDueTime: checked });
    }
  };

  // Get task type badge
  const getTaskTypeBadge = () => {
    if (task.type === "paper") {
      return (
        <Badge
          variant="secondary"
          className="text-xs bg-blue-100 text-blue-800"
        >
          Paper
        </Badge>
      );
    }
    if (task.type === "topic") {
      return (
        <Badge
          variant="secondary"
          className="text-xs bg-green-100 text-green-800"
        >
          Topic
        </Badge>
      );
    }
    return null;
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-4 bg-card transition-all hover:shadow-md",
        task.completed && "opacity-60 bg-muted/50",
        isOverdue && !task.completed && "border-destructive bg-destructive/5"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onUpdate({ completed: !!checked })}
          className="mt-1"
        />

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                    className="text-sm"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h4
                    className={cn(
                      "font-medium text-sm",
                      task.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </h4>
                  {getTaskTypeBadge()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {isOverdue && !task.completed && (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onRemove}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-col sm:flex-row gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Start:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {showStartTime
                      ? format(task.startDate, "MMM d, h:mm a")
                      : format(task.startDate, "MMM d")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="p-3 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={showStartTime}
                        onCheckedChange={(checked) =>
                          handleShowTimeToggle(checked, true)
                        }
                      />
                      <Label className="text-sm">Show time</Label>
                    </div>
                    <CalendarComponent
                      mode="single"
                      selected={task.startDate}
                      onSelect={(date) =>
                        handleDateTimeUpdate(date, true, showStartTime)
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                    {showStartTime && (
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <Input
                            type="time"
                            value={format(task.startDate, "HH:mm")}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value
                                .split(":")
                                .map(Number);
                              handleTimeUpdate(hours, minutes, true);
                            }}
                            className="w-auto text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Due:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-6 px-2 text-xs",
                      isOverdue &&
                        !task.completed &&
                        "border-destructive text-destructive"
                    )}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {showDueTime
                      ? format(task.dueDate, "MMM d, h:mm a")
                      : format(task.dueDate, "MMM d")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="p-3 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={showDueTime}
                        onCheckedChange={(checked) =>
                          handleShowTimeToggle(checked, false)
                        }
                      />
                      <Label className="text-sm">Show time</Label>
                    </div>
                    <CalendarComponent
                      mode="single"
                      selected={task.dueDate}
                      onSelect={(date) =>
                        handleDateTimeUpdate(date, false, showDueTime)
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                    {showDueTime && (
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <Input
                            type="time"
                            value={format(task.dueDate, "HH:mm")}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value
                                .split(":")
                                .map(Number);
                              handleTimeUpdate(hours, minutes, false);
                            }}
                            className="w-auto text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <span
                className={cn(
                  "text-xs px-2 py-1 rounded",
                  task.completed
                    ? "bg-green-100 text-green-800"
                    : daysUntilDue === 0
                    ? "bg-yellow-100 text-yellow-800"
                    : daysUntilDue > 0
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {task.completed
                  ? "Completed"
                  : daysUntilDue === 0
                  ? "Due today"
                  : daysUntilDue > 0
                  ? `${daysUntilDue} days left`
                  : `${Math.abs(daysUntilDue)} days overdue`}
              </span>
            </div>
          </div>

          {/* Remaining Time Progress Bar */}
          {remainingProgress !== null && (
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Time remaining</span>
                <span
                  className={cn(
                    "text-muted-foreground",
                    task.completed && "text-green-600",
                    isOverdue && !task.completed && "text-destructive"
                  )}
                >
                  {task.completed
                    ? "Complete"
                    : `${Math.round(remainingProgress)}%`}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    task.completed
                      ? "bg-green-500"
                      : isOverdue
                      ? "bg-destructive"
                      : "bg-primary"
                  )}
                  style={{
                    width: task.completed ? "100%" : `${remainingProgress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {task.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="h-6 px-2 text-xs w-20"
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddTag}
                className="h-6 w-6 p-0"
              >
                <Tag className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
