import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Tag,
  AlertTriangle,
  Clock,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { TopicsSidebar } from "./TopicsSidebar";
import { PastPapersSidebar } from "./PastPapersSidebar";
import { GanttItem } from "./GanttItem";
import { format, isAfter, startOfDay, addDays, addWeeks } from "date-fns";

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

interface GanttChartProps {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
}

const createComprehensiveStudyPlan = (): Omit<Task, "id">[] => {
  const today = new Date();

  return [
    // Week 1 - Cell Biology Foundation
    {
      title: "Cell Structure Overview",
      startDate: today,
      dueDate: addDays(today, 1),
      completed: false,
      tags: ["High Priority", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Plasma Membrane Structure",
      startDate: addDays(today, 1),
      dueDate: addDays(today, 2),
      completed: false,
      tags: ["Theory", "Sub-topic"],
      type: "topic" as const,
    },
    {
      title: "Organelles Functions",
      startDate: addDays(today, 2),
      dueDate: addDays(today, 3),
      completed: false,
      tags: ["Theory", "Sub-topic"],
      type: "topic" as const,
    },
    {
      title: "Solve May 2023 Paper 41",
      startDate: addDays(today, 3),
      dueDate: addDays(today, 4),
      completed: false,
      tags: ["recent", "Practice"],
      type: "paper" as const,
    },

    // Week 2 - Biological Molecules
    {
      title: "Carbohydrates Structure & Function",
      startDate: addDays(today, 5),
      dueDate: addDays(today, 7),
      completed: false,
      tags: ["Theory", "Review"],
      type: "topic" as const,
    },
    {
      title: "Monosaccharides vs Disaccharides",
      startDate: addDays(today, 6),
      dueDate: addDays(today, 7),
      completed: false,
      tags: ["Sub-topic", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Lipids and Fatty Acids",
      startDate: addDays(today, 8),
      dueDate: addDays(today, 10),
      completed: false,
      tags: ["Theory"],
      type: "topic" as const,
    },
    {
      title: "Phospholipid Bilayer",
      startDate: addDays(today, 9),
      dueDate: addDays(today, 10),
      completed: false,
      tags: ["Sub-topic", "High Priority"],
      type: "topic" as const,
    },
    {
      title: "Solve October 2022 Paper 42",
      startDate: addDays(today, 11),
      dueDate: addDays(today, 12),
      completed: false,
      tags: ["Practice"],
      type: "paper" as const,
    },

    // Week 3 - Proteins & Enzymes
    {
      title: "Protein Structure Levels",
      startDate: addDays(today, 13),
      dueDate: addDays(today, 15),
      completed: false,
      tags: ["High Priority", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Primary & Secondary Structure",
      startDate: addDays(today, 14),
      dueDate: addDays(today, 15),
      completed: false,
      tags: ["Sub-topic", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Tertiary & Quaternary Structure",
      startDate: addDays(today, 15),
      dueDate: addDays(today, 16),
      completed: false,
      tags: ["Sub-topic", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Enzyme Kinetics",
      startDate: addDays(today, 16),
      dueDate: addDays(today, 18),
      completed: false,
      tags: ["High Priority", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Lock and Key vs Induced Fit",
      startDate: addDays(today, 17),
      dueDate: addDays(today, 18),
      completed: false,
      tags: ["Sub-topic", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Solve May 2024 Paper 43",
      startDate: addDays(today, 19),
      dueDate: addDays(today, 20),
      completed: false,
      tags: ["recent", "Practice"],
      type: "paper" as const,
    },

    // Week 4 - Transport Systems
    {
      title: "Transport in Plants Overview",
      startDate: addDays(today, 21),
      dueDate: addDays(today, 23),
      completed: false,
      tags: ["Theory"],
      type: "topic" as const,
    },
    {
      title: "Xylem Structure & Function",
      startDate: addDays(today, 22),
      dueDate: addDays(today, 23),
      completed: false,
      tags: ["Sub-topic", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Phloem & Translocation",
      startDate: addDays(today, 23),
      dueDate: addDays(today, 24),
      completed: false,
      tags: ["Sub-topic", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Gas Exchange Systems",
      startDate: addDays(today, 25),
      dueDate: addDays(today, 27),
      completed: false,
      tags: ["High Priority", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Alveoli Adaptations",
      startDate: addDays(today, 26),
      dueDate: addDays(today, 27),
      completed: false,
      tags: ["Sub-topic", "High Priority"],
      type: "topic" as const,
    },
    {
      title: "Solve November 2023 Paper 41",
      startDate: addDays(today, 28),
      dueDate: addDays(today, 29),
      completed: false,
      tags: ["recent", "Practice"],
      type: "paper" as const,
    },

    // Week 5 - Coordination & Response
    {
      title: "Nervous System Structure",
      startDate: addDays(today, 30),
      dueDate: addDays(today, 32),
      completed: false,
      tags: ["Theory", "Review"],
      type: "topic" as const,
    },
    {
      title: "Neuron Types & Functions",
      startDate: addDays(today, 31),
      dueDate: addDays(today, 32),
      completed: false,
      tags: ["Sub-topic", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Synapse Transmission",
      startDate: addDays(today, 32),
      dueDate: addDays(today, 33),
      completed: false,
      tags: ["Sub-topic", "High Priority"],
      type: "topic" as const,
    },
    {
      title: "Hormonal Control Systems",
      startDate: addDays(today, 34),
      dueDate: addDays(today, 36),
      completed: false,
      tags: ["Theory"],
      type: "topic" as const,
    },
    {
      title: "Insulin & Glucagon",
      startDate: addDays(today, 35),
      dueDate: addDays(today, 36),
      completed: false,
      tags: ["Sub-topic", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Solve June 2022 Paper 42",
      startDate: addDays(today, 37),
      dueDate: addDays(today, 38),
      completed: false,
      tags: ["Practice"],
      type: "paper" as const,
    },

    // Week 6 - Genetics & Evolution
    {
      title: "Mendelian Genetics",
      startDate: addDays(today, 39),
      dueDate: addDays(today, 41),
      completed: false,
      tags: ["High Priority", "Practice"],
      type: "topic" as const,
    },
    {
      title: "Monohybrid Crosses",
      startDate: addDays(today, 40),
      dueDate: addDays(today, 41),
      completed: false,
      tags: ["Sub-topic", "Practice"],
      type: "topic" as const,
    },
    {
      title: "Dihybrid Crosses",
      startDate: addDays(today, 41),
      dueDate: addDays(today, 42),
      completed: false,
      tags: ["Sub-topic", "Practice"],
      type: "topic" as const,
    },
    {
      title: "Evolution & Natural Selection",
      startDate: addDays(today, 43),
      dueDate: addDays(today, 45),
      completed: false,
      tags: ["Theory"],
      type: "topic" as const,
    },
    {
      title: "Hardy-Weinberg Principle",
      startDate: addDays(today, 44),
      dueDate: addDays(today, 45),
      completed: false,
      tags: ["Sub-topic", "Theory"],
      type: "topic" as const,
    },
    {
      title: "Solve October 2023 Paper 43",
      startDate: addDays(today, 46),
      dueDate: addDays(today, 47),
      completed: false,
      tags: ["recent", "Practice"],
      type: "paper" as const,
    },

    // Week 7-8 - Advanced Topics
    {
      title: "Molecular Biology Techniques",
      startDate: addDays(today, 48),
      dueDate: addDays(today, 50),
      completed: false,
      tags: ["Theory", "Advanced"],
      type: "topic" as const,
    },
    {
      title: "PCR & Gel Electrophoresis",
      startDate: addDays(today, 49),
      dueDate: addDays(today, 50),
      completed: false,
      tags: ["Sub-topic", "Advanced"],
      type: "topic" as const,
    },
    {
      title: "DNA Sequencing Methods",
      startDate: addDays(today, 50),
      dueDate: addDays(today, 51),
      completed: false,
      tags: ["Sub-topic", "Advanced"],
      type: "topic" as const,
    },
    {
      title: "Solve May 2024 Paper 41",
      startDate: addDays(today, 52),
      dueDate: addDays(today, 53),
      completed: false,
      tags: ["recent", "Practice"],
      type: "paper" as const,
    },
    {
      title: "Biotechnology Applications",
      startDate: addDays(today, 54),
      dueDate: addDays(today, 56),
      completed: false,
      tags: ["Theory", "Advanced"],
      type: "topic" as const,
    },
    {
      title: "Gene Therapy & Cloning",
      startDate: addDays(today, 55),
      dueDate: addDays(today, 56),
      completed: false,
      tags: ["Sub-topic", "Advanced"],
      type: "topic" as const,
    },

    // Final Weeks - Review & Mock Exams
    {
      title: "Comprehensive Review - Cell Biology",
      startDate: addDays(today, 57),
      dueDate: addDays(today, 59),
      completed: false,
      tags: ["High Priority", "Review"],
      type: "custom" as const,
    },
    {
      title: "Comprehensive Review - Biochemistry",
      startDate: addDays(today, 60),
      dueDate: addDays(today, 62),
      completed: false,
      tags: ["High Priority", "Review"],
      type: "custom" as const,
    },
    {
      title: "Mock Exam - May 2024 Paper 42",
      startDate: addDays(today, 63),
      dueDate: addDays(today, 64),
      completed: false,
      tags: ["recent", "High Priority", "Mock"],
      type: "paper" as const,
    },
    {
      title: "Weak Areas Targeted Study",
      startDate: addDays(today, 65),
      dueDate: addDays(today, 67),
      completed: false,
      tags: ["High Priority", "Review"],
      type: "custom" as const,
    },
    {
      title: "Final Mock - November 2023 Paper 43",
      startDate: addDays(today, 68),
      dueDate: addDays(today, 69),
      completed: false,
      tags: ["recent", "High Priority", "Mock"],
      type: "paper" as const,
    },
    {
      title: "Last Minute Review",
      startDate: addDays(today, 70),
      dueDate: addDays(today, 71),
      completed: false,
      tags: ["High Priority", "Review"],
      type: "custom" as const,
    },
  ];
};

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  addTask,
  updateTask,
  removeTask,
}) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    startDate: new Date(),
    dueDate: new Date(),
    tags: [] as string[],
    newTag: "",
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showDueTime, setShowDueTime] = useState(false);

  const today = startOfDay(new Date());

  const overdueTasks = tasks.filter(
    (task) => !task.completed && isAfter(today, startOfDay(task.dueDate))
  );

  const handleLoadTemplate = () => {
    const comprehensivePlan = createComprehensiveStudyPlan();
    comprehensivePlan.forEach((task) => {
      addTask(task);
    });
  };

  const handleClearTemplate = () => {
    // Remove all tasks
    tasks.forEach((task) => {
      removeTask(task.id);
    });
  };

  const handleDateTimeUpdate = (
    date: Date | undefined,
    isStartDate: boolean,
    showTime: boolean
  ) => {
    if (!date) return;

    const currentDate = isStartDate ? newTask.startDate : newTask.dueDate;
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

    setNewTask((prev) => ({
      ...prev,
      [isStartDate ? "startDate" : "dueDate"]: newDate,
    }));
  };

  const handleTimeUpdate = (
    hours: number,
    minutes: number,
    isStartDate: boolean
  ) => {
    const currentDate = isStartDate ? newTask.startDate : newTask.dueDate;
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes
    );

    setNewTask((prev) => ({
      ...prev,
      [isStartDate ? "startDate" : "dueDate"]: newDate,
    }));
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addTask({
        title: newTask.title,
        startDate: newTask.startDate,
        dueDate: newTask.dueDate,
        completed: false,
        tags: newTask.tags,
        type: "custom",
      });

      setNewTask({
        title: "",
        startDate: new Date(),
        dueDate: new Date(),
        tags: [],
        newTag: "",
      });
      setShowAddTask(false);
    }
  };

  const handleAddTag = () => {
    if (
      newTask.newTag.trim() &&
      !newTask.tags.includes(newTask.newTag.trim())
    ) {
      setNewTask((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewTask((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleTopicDrop = (topicData: any) => {
    const tags = [topicData.parentTopicName];

    addTask({
      title: topicData.title,
      startDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      completed: false,
      tags: tags,
      type: "topic",
      topicId: topicData.topicId,
      unitId: topicData.unitId,
    });
  };

  const handlePaperDrop = (paperData: any) => {
    const tags = [];
    if (paperData.year === 2024 || paperData.year === 2025) {
      tags.push("recent");
    }

    addTask({
      title: `Solve ${paperData.name}`,
      startDate: new Date(),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      completed: false,
      tags: tags,
      type: "paper",
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));

      if (data.type === "topic") {
        handleTopicDrop(data);
      } else if (data.type === "paper") {
        handlePaperDrop(data);
      }
    } catch (error) {
      console.error("Error parsing drop data:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Sidebars */}
      <div className="flex lg:flex-col gap-4 lg:gap-0">
        <TopicsSidebar onTopicDrop={handleTopicDrop} />
        <PastPapersSidebar onPaperDrop={handlePaperDrop} />
      </div>

      {/* Main Gantt Area */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Study Schedule</h2>
            {overdueTasks.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {overdueTasks.length} overdue
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleLoadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Load Template
            </Button>

            {tasks.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Tasks</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {tasks.length} tasks from
                      your study schedule. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearTemplate}>
                      Delete All Tasks
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Custom Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Task</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter task title..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {showStartTime
                              ? format(newTask.startDate, "PPP 'at' h:mm a")
                              : format(newTask.startDate, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <div className="p-3 space-y-3">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={showStartTime}
                                onCheckedChange={setShowStartTime}
                              />
                              <Label className="text-sm">Show time</Label>
                            </div>
                            <CalendarComponent
                              mode="single"
                              selected={newTask.startDate}
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
                                    value={format(newTask.startDate, "HH:mm")}
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

                    <div>
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {showDueTime
                              ? format(newTask.dueDate, "PPP 'at' h:mm a")
                              : format(newTask.dueDate, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <div className="p-3 space-y-3">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={showDueTime}
                                onCheckedChange={setShowDueTime}
                              />
                              <Label className="text-sm">Show time</Label>
                            </div>
                            <CalendarComponent
                              mode="single"
                              selected={newTask.dueDate}
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
                                    value={format(newTask.dueDate, "HH:mm")}
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
                    </div>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newTask.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTask.newTag}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            newTag: e.target.value,
                          }))
                        }
                        placeholder="Add tag..."
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddTag}
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleAddTask} className="w-full">
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Drop Zone for Tasks */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5 border-solid"
              : "border-muted-foreground/30"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div
            className={`text-center ${
              isDragOver ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">
              Drop topics or papers here to create study tasks
            </p>
            <p className="text-xs mt-1">
              Drag from the sidebar to automatically create scheduled tasks
            </p>
          </div>

          {/* Tasks List */}
          <div className="space-y-2 mt-6">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks scheduled yet</p>
                <p className="text-sm">
                  Load a template, drag topics from the sidebar, or add custom
                  tasks
                </p>
              </div>
            ) : (
              tasks
                .sort(
                  (a, b) =>
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime()
                )
                .map((task) => (
                  <GanttItem
                    key={task.id}
                    task={task}
                    onUpdate={(updates) => updateTask(task.id, updates)}
                    onRemove={() => removeTask(task.id)}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
