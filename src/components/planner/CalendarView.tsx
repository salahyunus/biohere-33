import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";

interface Task {
  id: string;
  title: string;
  startDate: Date;
  dueDate: Date;
  completed: boolean;
  tags: string[];
  type: "topic" | "custom";
  topicId?: string;
  unitId?: string;
}

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onTaskClick,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) =>
        isSameDay(task.dueDate, date) ||
        (task.startDate <= date && task.dueDate >= date)
    );
  };

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const dayHasTasks = (date: Date) => {
    return getTasksForDate(date).length > 0;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="w-full border rounded-md p-3"
          modifiers={{
            hasTasks: dayHasTasks,
          }}
          modifiersStyles={{
            hasTasks: {
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              fontWeight: "bold",
            },
          }}
        />
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate
                ? format(selectedDate, "MMMM d, yyyy")
                : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No tasks for this date
              </p>
            ) : (
              <div className="space-y-3">
                {selectedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onTaskClick?.(task)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      {task.completed && (
                        <Badge variant="secondary" className="text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Due: {format(task.dueDate, "MMM d, h:mm a")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span>Days with tasks</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
