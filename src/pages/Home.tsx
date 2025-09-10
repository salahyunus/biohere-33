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
    name: "Project Dashboard",
    description: "Organize your web development projects",
  },
  {
    path: "/grade-boundary",
    name: "Performance Analytics",
    description: "Analyze website performance and optimization",
  },
  {
    path: "/past-papers",
    name: "Code Challenges",
    description: "Coding exercises and programming challenges",
  },
  {
    path: "/mcq-solver",
    name: "AI Code Helper",
    description: "AI-powered coding assistance and suggestions",
  },
  {
    path: "/written-solver",
    name: "Debug Assistant", 
    description: "Get help debugging and fixing your code",
  },
  {
    path: "/topical",
    name: "Technology Tutorials",
    description: "Learn specific web development technologies",
  },
  {
    path: "/quiz-generator",
    name: "Code Quiz Generator",
    description: "Create interactive coding quizzes and tests",
  },
  {
    path: "/notes",
    name: "Development Notes",
    description: "Create and manage coding documentation",
  },
  {
    path: "/flashcards",
    name: "Tech Flashcards",
    description: "Master web dev concepts with flashcards",
  },
  {
    path: "/planner",
    name: "Project Planner",
    description: "Plan development projects and deadlines",
  },
  {
    path: "/syllabus",
    name: "Learning Path Tracker",
    description: "Track your web development learning progress",
  },
  {
    path: "/vault",
    name: "Resource Library",
    description: "Web dev resources, tools, and documentation",
  },
  {
    path: "/whatsapp-community",
    name: "Developer Community",
    description: "Join our web development community",
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
            <span className="text-3xl">🦆</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold">Quackly</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your ultimate web development toolkit - from coding challenges to performance optimization, 
            everything you need to build amazing web experiences
          </p>
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for dev tools..."
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
                    No dev tools found for "{searchQuery}"
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
          Developer Tools
        </h2>
        <NavigationCards />
      </section>
    </div>
  );
};

export default HomePage;
