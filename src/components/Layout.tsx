import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeSelector } from "./ThemeSelector";

const pageNames: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/grade-boundary": "Grade Boundary Analysis",
  "/past-papers": "Past Papers+",
  "/mcq-solver": "MCQ Solver",
  "/written-solver": "Written Solver",
  "/topical": "Topical/Classified+",
  "/quiz-generator": "Quiz/Exam Generator",
  "/notes": "Notes",
  "/flashcards": "Flashcards",
  "/planner": "Planner + Exam Timer",
  "/syllabus": "Syllabus Checklist",
  "/vault": "Resource Vault",
};

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="hover:scale-105 transition-all">
            <Link to={"/"}>
              <h1 className=" text-xl font-bold text-primary">
                Biology Unit-4
              </h1>
              <p className="text-sm text-muted-foreground">
                Edexcel IAL Study Hub
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold hidden sm:block">
              {pageNames[location.pathname] || "Home"}
            </h2>
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};
