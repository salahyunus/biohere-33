import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Dna,
  FileText,
  Link2,
  Search,
} from "lucide-react";
import { NavigationCards } from "@/components/NavigationCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const searchableItems = [
  {
    path: "/dashboard",
    name: "Dashboard",
    description: "Organize your study materials",
  },
  {
    path: "/grade-boundary",
    name: "Grade Boundary",
    description: "Calculate grades and UMS",
  },
  {
    path: "/past-papers",
    name: "Past Papers",
    description: "Access exam papers and solutions",
  },
  {
    path: "/mcq-solver",
    name: "MCQ Solver",
    description: "AI-powered multiple choice help",
  },
  {
    path: "/written-solver",
    name: "Written Solver",
    description: "Get help with written questions",
  },
  {
    path: "/topical",
    name: "Topical Questions",
    description: "Topic-wise question practice",
  },
  {
    path: "/quiz-generator",
    name: "Quiz Generator",
    description: "Create custom quizzes and tests",
  },
  {
    path: "/notes",
    name: "Notes",
    description: "Create and manage study notes",
  },
  {
    path: "/flashcards",
    name: "Flashcards",
    description: "Interactive flashcard system",
  },
  {
    path: "/planner",
    name: "Planner",
    description: "Plan studies and time exams",
  },
  {
    path: "/syllabus",
    name: "Syllabus Checklist",
    description: "Track syllabus progress",
  },
  {
    path: "/vault",
    name: "Resource Vault",
    description: "Download PDFs, notes and links",
  },
  {
    path: "/whatsapp-community",
    name: "WhatsApp Community",
    description: "Join our study community",
  },
  {
    path: "/mind-maps",
    name: "Mind Maps",
    description: "Create interactive mind maps",
  },
];

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchableItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSearchFocus = () => setShowSearchResults(true);
  const handleSearchBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const handleResultClick = (path: string) => {
    navigate(path);
    setSearchQuery("");
    setShowSearchResults(false);
  };
  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in px-4 sm:px-0">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center space-y-8 animate-fade-in">
          <div className="w-20 h-20 bg-primary rounded-2xl hover:rounded-[50%] transition-all flex items-center justify-center mx-auto shadow-medium">
            <Dna className="h-10 w-10 text-primary-foreground" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold">IAL Biology U4</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Master Edexcel IAL Biology Unit 4 with comprehensive study tools and
            resources designed for success
          </p>
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {showSearchResults && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredResults.length > 0 ? (
                  filteredResults.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleResultClick(item.path)}
                      className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-foreground">
                          {item.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-muted-foreground text-center">
                    No tools found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
          <Link to="/dashboard">
            <Button
              size="lg"
              className="mt-8 px-8 py-4 text-lg animate-scale-in"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Navigation Cards */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8">
          Study Tools
        </h2>
        <NavigationCards />
      </section>
    </div>
  );
};

export default HomePage;
