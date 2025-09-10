import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Calculator,
  FileText,
  MessageSquare,
  PenTool,
  BookOpen,
  Gamepad2,
  StickyNote,
  Layers,
  Calendar,
  CheckSquare,
  Archive,
  MessageCircle,
  Info,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSyllabusData } from "@/hooks/useSyllabusData";

const navigationItems = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    description: "Organize your study materials",
    iconColor: "text-blue-500",
  },
  {
    path: "/grade-boundary",
    name: "Grade Boundary",
    icon: Calculator,
    description: "Calculate grades and UMS",
    iconColor: "text-green-500",
  },
  {
    path: "/past-papers",
    name: "Past Papers",
    icon: FileText,
    description: "Access exam papers and solutions",
    iconColor: "text-purple-500",
  },
  {
    path: "/mcq-solver",
    name: "MCQ Solver",
    icon: MessageSquare,
    description: "AI-powered multiple choice help",
    iconColor: "text-orange-500",
  },
  {
    path: "/written-solver",
    name: "Written Solver",
    icon: PenTool,
    description: "Get help with written questions",
    iconColor: "text-red-500",
  },
  {
    path: "/topical",
    name: "Topical Questions",
    icon: BookOpen,
    description: "Topic-wise question practice",
    iconColor: "text-indigo-500",
  },
  {
    path: "/quiz-generator",
    name: "Quiz Generator",
    icon: Gamepad2,
    description: "Create custom quizzes and tests",
    iconColor: "text-pink-500",
  },
  {
    path: "/notes",
    name: "Notes",
    icon: StickyNote,
    description: "Create and manage study notes",
    iconColor: "text-yellow-500",
  },
  {
    path: "/flashcards",
    name: "Flashcards",
    icon: Layers,
    description: "Interactive flashcard system",
    iconColor: "text-teal-500",
  },
  {
    path: "/planner",
    name: "Planner",
    icon: Calendar,
    description: "Plan studies and time exams",
    iconColor: "text-cyan-500",
  },
  {
    path: "/syllabus",
    name: "Syllabus Checklist",
    icon: CheckSquare,
    description: "Track syllabus progress",
    iconColor: "text-emerald-500",
  },
  {
    path: "/vault",
    name: "Resource Vault",
    icon: Archive,
    description: "Download PDFs, notes and links",
    iconColor: "text-violet-500",
  },
  {
    path: "/about",
    name: "About & Info",
    icon: Info,
    description: "Learn about Unit-4 Biology",
    iconColor: "text-slate-500",
  },
  {
    path: "/whatsapp-community",
    name: "WhatsApp Community",
    icon: MessageCircle,
    description: "Join our study community",
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
