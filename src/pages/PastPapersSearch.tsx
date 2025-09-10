import React, { useState, useEffect } from "react";
import { Search, ArrowLeft, FileText, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { usePastPapers } from "@/hooks/usePastPapers";

interface SearchResult {
  paperId: string;
  year: number;
  session: string;
  questionNumber: string;
  question: string;
  answer: string;
  marks: number;
  matchType: "question" | "answer" | "both";
}

const PastPapersSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { searchInContent } = usePastPapers();

  useEffect(() => {
    if (searchTerm.trim().length >= 3) {
      setIsSearching(true);
      // Debounce search
      const timeoutId = setTimeout(() => {
        const searchResults = searchInContent(searchTerm);
        setResults(searchResults);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [searchTerm, searchInContent]);

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-primary/20 text-primary font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleViewFullPaper = (paperId: string) => {
    // Navigate to paper viewer
    window.open(`/papers/${paperId}`, "_blank");
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/past-papers")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Advanced Search</h1>
            <p className="text-muted-foreground">
              Search through all questions and answers in our past papers
              database
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search for specific questions, answers, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 text-lg py-6"
            autoFocus
          />
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {isSearching && (
            <div className="text-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-muted-foreground">Searching...</p>
            </div>
          )}

          {!isSearching &&
            searchTerm.trim().length > 0 &&
            results.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No results found for "{searchTerm}"
                </p>
              </div>
            )}

          {!isSearching && results.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Found {results.length} result{results.length !== 1 ? "s" : ""}
                </h2>
              </div>

              {results.map((result, index) => (
                <Card
                  key={`${result.paperId}-${result.questionNumber}-${index}`}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {result.year} {result.session} Question Paper
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">
                            Question {result.questionNumber}
                          </Badge>
                          <Badge variant="outline">{result.marks} marks</Badge>
                          <Badge
                            variant={
                              result.matchType === "both"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {result.matchType === "both"
                              ? "Question & Answer"
                              : result.matchType === "question"
                              ? "Question"
                              : "Answer"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewFullPaper(result.paperId)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Full Paper
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">
                          Question:
                        </h4>
                        <p className="text-sm leading-relaxed">
                          {highlightText(result.question, searchTerm)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-600 mb-2">
                          Answer:
                        </h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {highlightText(result.answer, searchTerm)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Enter at least 3 characters to search
              </p>
            </div>
          )}

          {searchTerm.trim().length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start Your Search</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter keywords to search through thousands of past paper
                questions and answers. Find specific topics, concepts, or
                question types instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastPapersSearch;
