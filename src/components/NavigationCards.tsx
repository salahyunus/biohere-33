import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Code2,
  Bot,
  Bug,
  BookOpen,
  Gamepad2,
  FileText,
  Layers,
  Calendar,
  Target,
  Archive,
  MessageCircle,
  Info,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSyllabusData } from "@/hooks/useSyllabusData";

const navigationItems = [
  {
    path: "/dashboard",
    name: "Project Dashboard",
    icon: LayoutDashboard,
    description: "Organize your web dev projects",
    iconColor: "text-blue-500",
  },
  {
    path: "/grade-boundary",
    name: "Performance Analytics",
    icon: BarChart3,
    description: "Analyze website performance metrics",
    iconColor: "text-green-500",
  },
  {
    path: "/past-papers",
    name: "Code Challenges",
    icon: Code2,
    description: "Coding exercises and challenges",
    iconColor: "text-purple-500",
  },
  {
    path: "/mcq-solver",
    name: "AI Code Helper",
    icon: Bot,
    description: "AI-powered coding assistance",
    iconColor: "text-orange-500",
  },
  {
    path: "/written-solver",
    name: "Debug Assistant",
    icon: Bug,
    description: "Get help debugging your code",
    iconColor: "text-red-500",
  },
  {
    path: "/topical",
    name: "Tech Tutorials",
    icon: BookOpen,
    description: "Learn web development technologies",
    iconColor: "text-indigo-500",
  },
  {
    path: "/quiz-generator",
    name: "Code Quiz Generator",
    icon: Gamepad2,
    description: "Create interactive coding quizzes",
    iconColor: "text-pink-500",
  },
  {
    path: "/notes",
    name: "Dev Notes",
    icon: FileText,
    description: "Create coding documentation",
    iconColor: "text-yellow-500",
  },
  {
    path: "/flashcards",
    name: "Tech Flashcards",
    icon: Layers,
    description: "Master web dev concepts",
    iconColor: "text-teal-500",
  },
  {
    path: "/planner",
    name: "Project Planner",
    icon: Calendar,
    description: "Plan development projects",
    iconColor: "text-cyan-500",
  },
  {
    path: "/syllabus",
    name: "Learning Tracker",
    icon: Target,
    description: "Track learning progress",
    iconColor: "text-emerald-500",
  },
  {
    path: "/vault",
    name: "Resource Library",
    icon: Archive,
    description: "Web dev resources and tools",
    iconColor: "text-violet-500",
  },
  {
    path: "/about",
    name: "About Quackly",
    icon: Info,
    description: "Learn about web development",
    iconColor: "text-slate-500",
  },
  {
    path: "/whatsapp-community",
    name: "Developer Community",
    icon: MessageCircle,
    description: "Join our dev community",
    iconColor: "text-green-600",
  },
];

export const NavigationCards: React.FC = () => {
  const { getTotalProgress } = useSyllabusData();
  const syllabusProgress = getTotalProgress();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const showProgress = item.path === "/syllabus" && syllabusProgress > 0;

        return (
          <Link key={item.path} to={item.path} className="group block">
            <div className="bg-card border rounded-xl p-8 aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/20">
              <Icon
                className={`h-12 w-12 mb-4 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
              />
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              {showProgress && (
                <div className="w-full mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-xs font-medium text-primary">
                      {Math.round(syllabusProgress)}%
                    </span>
                  </div>
                  <Progress value={syllabusProgress} className="h-1.5" />
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
