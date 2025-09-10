import React, { useState } from "react";
import {
  Download,
  Filter,
  Search,
  Check,
  X,
  Edit3,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { keywordsData } from "@/data/keywords";
import { cn } from "@/lib/utils";

interface ExtendedKeyword {
  id: string;
  term: string;
  definition: string;
  topic: string;
}

// Extended keywords data with topics
const extendedKeywords: ExtendedKeyword[] = [
  ...keywordsData.map((keyword, index) => ({
    id: `${index + 1}`,
    term: keyword.term,
    definition: keyword.definition,
    topic: index < 5 ? "Physics" : index < 10 ? "Chemistry" : "Biology",
  })),
  // Add more keywords for better demonstration
  {
    id: "16",
    term: "osmosis",
    definition:
      "The movement of water molecules through a selectively permeable membrane from an area of high water concentration to an area of low water concentration",
    topic: "Biology",
  },
  {
    id: "17",
    term: "photosynthesis",
    definition:
      "The process by which plants use sunlight, carbon dioxide, and water to produce glucose and oxygen",
    topic: "Biology",
  },
  {
    id: "18",
    term: "kinetic energy",
    definition:
      "The energy possessed by an object due to its motion, calculated as ½mv²",
    topic: "Physics",
  },
  {
    id: "19",
    term: "catalyst",
    definition:
      "A substance that increases the rate of a chemical reaction without being consumed in the process",
    topic: "Chemistry",
  },
  {
    id: "20",
    term: "allele",
    definition:
      "One of two or more alternative forms of a gene that arise by mutation and are found at the same place on a chromosome",
    topic: "Biology",
  },
];

type InputMode = "keyword" | "definition" | null;

interface KeywordState {
  inputMode: InputMode;
  inputValue: string;
  isCorrect: boolean | null;
}

const KeywordsLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [keywordStates, setKeywordStates] = useState<
    Record<string, KeywordState>
  >({});

  const topics = [
    "all",
    ...Array.from(new Set(extendedKeywords.map((k) => k.topic))),
  ];

  const filteredKeywords = extendedKeywords.filter((keyword) => {
    const matchesSearch =
      keyword.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keyword.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic =
      selectedTopic === "all" || keyword.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const handleDownloadPdf = () => {
    // Simulate PDF download
    const link = document.createElement("a");
    link.href = "#";
    link.download = `keywords-definitions-${selectedTopic}.pdf`;
    link.click();
  };

  const enterInputMode = (keywordId: string, mode: InputMode) => {
    setKeywordStates((prev) => ({
      ...prev,
      [keywordId]: {
        inputMode: mode,
        inputValue: "",
        isCorrect: null,
      },
    }));
  };

  const cancelInputMode = (keywordId: string) => {
    setKeywordStates((prev) => {
      const newState = { ...prev };
      delete newState[keywordId];
      return newState;
    });
  };

  const handleInputChange = (keywordId: string, value: string) => {
    const keyword = extendedKeywords.find((k) => k.id === keywordId);
    if (!keyword) return;

    const state = keywordStates[keywordId];
    if (!state) return;

    let isCorrect: boolean | null = null;

    if (state.inputMode === "keyword") {
      // Simple similarity check for keywords
      const similarity =
        value.toLowerCase().trim() === keyword.term.toLowerCase().trim();
      isCorrect = similarity;
    } else if (state.inputMode === "definition") {
      // Basic definition matching (check if key words are present)
      const originalWords = keyword.definition
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 3);
      const inputWords = value
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 3);
      const matchingWords = inputWords.filter((word) =>
        originalWords.some(
          (origWord) => origWord.includes(word) || word.includes(origWord)
        )
      );

      // Consider correct if at least 30% of significant words match
      isCorrect =
        matchingWords.length >=
        Math.max(1, Math.floor(originalWords.length * 0.3));
    }

    setKeywordStates((prev) => ({
      ...prev,
      [keywordId]: {
        ...state,
        inputValue: value,
        isCorrect,
      },
    }));
  };

  const handleInputSubmit = (keywordId: string) => {
    const state = keywordStates[keywordId];
    if (state && state.isCorrect) {
      // Show success and return to normal mode after a delay
      setTimeout(() => {
        cancelInputMode(keywordId);
      }, 1500);
    }
  };

  const getInputClassName = (keywordId: string) => {
    const state = keywordStates[keywordId];
    if (!state || state.isCorrect === null) return "";

    return state.isCorrect
      ? "border-green-500 bg-green-50 text-green-900"
      : "border-red-500 bg-red-50 text-red-900";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Keywords Library</h1>
          <p className="text-muted-foreground">
            Study key terms and test your knowledge interactively
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search keywords or definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic === "all" ? "All Topics" : topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredKeywords.length} keywords
          {selectedTopic !== "all" && ` in ${selectedTopic}`}
        </div>

        {/* Keywords Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKeywords.map((keyword) => {
            const state = keywordStates[keyword.id];

            return (
              <Card
                key={keyword.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {keyword.topic}
                    </Badge>
                    {state?.isCorrect && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>

                  {/* Keyword Term */}
                  <CardTitle className="text-lg">
                    {state?.inputMode === "keyword" ? (
                      <div className="space-y-2">
                        <Input
                          value={state.inputValue}
                          onChange={(e) =>
                            handleInputChange(keyword.id, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleInputSubmit(keyword.id);
                            }
                          }}
                          placeholder="Enter the keyword..."
                          className={cn(
                            "text-lg font-semibold",
                            getInputClassName(keyword.id)
                          )}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => cancelInputMode(keyword.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {state.isCorrect && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleInputSubmit(keyword.id)}
                            >
                              <Check className="h-3 w-3 text-green-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <span>{keyword.term}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => enterInputMode(keyword.id, "keyword")}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {/* Definition */}
                  {state?.inputMode === "definition" ? (
                    <div className="space-y-2">
                      <textarea
                        value={state.inputValue}
                        onChange={(e) =>
                          handleInputChange(keyword.id, e.target.value)
                        }
                        placeholder="Enter your definition..."
                        className={cn(
                          "w-full min-h-20 p-2 border rounded-md text-sm resize-none",
                          getInputClassName(keyword.id)
                        )}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelInputMode(keyword.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {state.isCorrect && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleInputSubmit(keyword.id)}
                          >
                            <Check className="h-3 w-3 text-green-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {keyword.definition}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-0 right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => enterInputMode(keyword.id, "definition")}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredKeywords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No keywords found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or topic filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordsLibrary;
