
import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  startDate: Date;
  dueDate: Date;
  completed: boolean;
  tags: string[];
  type: 'topic' | 'custom';
  topicId?: string;
  unitId?: string;
}

export interface PlannerData {
  tasks: Task[];
  availableTags: string[];
}

const defaultData: PlannerData = {
  tasks: [],
  availableTags: ['High Priority', 'Review', 'Practice', 'Theory'],
};

export const usePlannerData = () => {
  const [data, setData] = useState<PlannerData>(defaultData);

  useEffect(() => {
    const saved = localStorage.getItem('plannerData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        if (parsed.tasks) {
          parsed.tasks = parsed.tasks.map((task: any) => ({
            ...task,
            startDate: new Date(task.startDate),
            dueDate: new Date(task.dueDate)
          }));
        }
        setData({ ...defaultData, ...parsed });
      } catch (error) {
        console.error('Failed to parse planner data:', error);
        setData(defaultData);
      }
    }
  }, []);

  const saveData = (newData: PlannerData) => {
    setData(newData);
    // Convert Date objects to strings for localStorage
    const toSave = {
      ...newData,
      tasks: newData.tasks.map(task => ({
        ...task,
        startDate: task.startDate.toISOString(),
        dueDate: task.dueDate.toISOString()
      }))
    };
    localStorage.setItem('plannerData', JSON.stringify(toSave));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    saveData({
      ...data,
      tasks: [...data.tasks, newTask],
    });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = data.tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    saveData({
      ...data,
      tasks: updatedTasks,
    });
  };

  const deleteTask = (taskId: string) => {
    const filteredTasks = data.tasks.filter(task => task.id !== taskId);
    saveData({
      ...data,
      tasks: filteredTasks,
    });
  };

  const removeTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const addTag = (tag: string) => {
    if (!data.availableTags.includes(tag)) {
      saveData({
        ...data,
        availableTags: [...data.availableTags, tag],
      });
    }
  };

  return {
    tasks: data.tasks,
    availableTags: data.availableTags,
    addTask,
    updateTask,
    deleteTask,
    removeTask,
    addTag,
  };
};
