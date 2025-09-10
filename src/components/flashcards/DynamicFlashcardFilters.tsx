import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CustomMultiSelect } from "@/components/CustomMultiSelect";
import { ChevronDown, ChevronUp, Filter, X, Play } from "lucide-react";
import { flashcardsData } from "@/data/flashcards";

interface DynamicFlashcardFiltersProps {
  selectedTopics: string[];
  selectedSubtopics: string[];
  selectedDifficulty: string[];
  onTopicsChange: (topics: string[]) => void;
  onSubtopicsChange: (subtopics: string[]) => void;
  onDifficultyChange: (difficulty: string[]) => void;
  filteredCount: number;
  onStartStudy: () => void;
}

export const DynamicFlashcardFilters: React.FC<
  DynamicFlashcardFiltersProps
> = ({
  selectedTopics,
  selectedSubtopics,
  selectedDifficulty,
  onTopicsChange,
  onSubtopicsChange,
  onDifficultyChange,
  filteredCount,
  onStartStudy,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const topics = [...new Set(flashcardsData.map((set) => set.topic))];
  const subtopics = [
    ...new Set(
      flashcardsData.flatMap((set) =>
        set.cards.map((card) => card.subtopic).filter(Boolean)
      )
    ),
  ] as string[];
  const difficulties = ["easy", "medium", "hard"];

  const topicOptions = topics.map((topic) => ({ value: topic, label: topic }));
  const subtopicOptions = subtopics.map((subtopic) => ({
    value: subtopic,
    label: subtopic,
  }));
  const difficultyOptions = difficulties.map((difficulty) => ({
    value: difficulty,
    label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    color:
      difficulty === "easy"
        ? "bg-green-500"
        : difficulty === "medium"
        ? "bg-yellow-500"
        : "bg-red-500",
  }));

  const clearAllFilters = () => {
    onTopicsChange([]);
    onSubtopicsChange([]);
    onDifficultyChange([]);
  };

  const getActiveFiltersCount = () => {
    return (
      selectedTopics.length +
      selectedSubtopics.length +
      selectedDifficulty.length
    );
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <div className="space-y-4">
      <Card>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <CardTitle className="text-sm">Filters</CardTitle>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="text-xs">
                      {getActiveFiltersCount()} active
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAllFilters();
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                {filteredCount} cards available
              </p>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0 animate-fade-in">
              <div>
                <label className="text-sm font-medium mb-2 block">Topics</label>
                <CustomMultiSelect
                  options={topicOptions}
                  selectedValues={selectedTopics}
                  onSelectionChange={onTopicsChange}
                  placeholder="Select topics..."
                />
              </div>

              {subtopics.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subtopics
                  </label>
                  <CustomMultiSelect
                    options={subtopicOptions}
                    selectedValues={selectedSubtopics}
                    onSelectionChange={onSubtopicsChange}
                    placeholder="Select subtopics..."
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Difficulty
                </label>
                <CustomMultiSelect
                  options={difficultyOptions}
                  selectedValues={selectedDifficulty}
                  onSelectionChange={onDifficultyChange}
                  placeholder="Select difficulty levels..."
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Your Set Is Ready Button */}
      {hasActiveFilters && filteredCount > 0 && (
        <Card className="border-2 border-primary bg-primary/5">
          <CardContent className="p-4 animate-fade-in">
            <div className="text-center space-y-3">
              <div>
                <h3 className="font-semibold text-primary">
                  Your Set Is Ready!
                </h3>
                <p className="text-sm text-muted-foreground">
                  {filteredCount} flashcard{filteredCount !== 1 ? "s" : ""}{" "}
                  match your selection
                </p>
              </div>
              <Button onClick={onStartStudy} className="w-full" size="lg">
                <Play className="h-5 w-5 mr-2" />
                Start Studying ({filteredCount} cards)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
