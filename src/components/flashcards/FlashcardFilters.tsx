import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { flashcardsData } from "@/data/flashcards";
import { X } from "lucide-react";

interface FlashcardFiltersProps {
  selectedTopics: string[];
  selectedSubtopics: string[];
  selectedDifficulty: string[];
  onTopicsChange: (topics: string[]) => void;
  onSubtopicsChange: (subtopics: string[]) => void;
  onDifficultyChange: (difficulty: string[]) => void;
  filteredCount: number;
}

export const FlashcardFilters: React.FC<FlashcardFiltersProps> = ({
  selectedTopics,
  selectedSubtopics,
  selectedDifficulty,
  onTopicsChange,
  onSubtopicsChange,
  onDifficultyChange,
  filteredCount,
}) => {
  const topics = [...new Set(flashcardsData.map((set) => set.topic))];
  const subtopics = [
    ...new Set(
      flashcardsData.flatMap((set) =>
        set.cards.map((card) => card.subtopic).filter(Boolean)
      )
    ),
  ] as string[];
  const difficulties = ["easy", "medium", "hard"];

  const clearAllFilters = () => {
    onTopicsChange([]);
    onSubtopicsChange([]);
    onDifficultyChange([]);
  };

  const handleTopicChange = (topic: string, checked: boolean) => {
    if (checked) {
      onTopicsChange([...selectedTopics, topic]);
    } else {
      onTopicsChange(selectedTopics.filter((t) => t !== topic));
    }
  };

  const handleSubtopicChange = (subtopic: string, checked: boolean) => {
    if (checked) {
      onSubtopicsChange([...selectedSubtopics, subtopic]);
    } else {
      onSubtopicsChange(selectedSubtopics.filter((s) => s !== subtopic));
    }
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    if (checked) {
      onDifficultyChange([...selectedDifficulty, difficulty]);
    } else {
      onDifficultyChange(selectedDifficulty.filter((d) => d !== difficulty));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Filters</CardTitle>
            {(selectedTopics.length > 0 ||
              selectedSubtopics.length > 0 ||
              selectedDifficulty.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 px-2"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {filteredCount} cards match your filters
          </p>
        </CardHeader>
        <CardContent className="animate-fade-in space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Topics</h4>
            <div className="space-y-2">
              {topics.map((topic) => (
                <div key={topic} className="flex items-center space-x-2">
                  <Checkbox
                    id={`topic-${topic}`}
                    checked={selectedTopics.includes(topic)}
                    onCheckedChange={(checked) =>
                      handleTopicChange(topic, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`topic-${topic}`}
                    className="text-sm cursor-pointer"
                  >
                    {topic}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {subtopics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Subtopics</h4>
              <div className="space-y-2">
                {subtopics.map((subtopic) => (
                  <div key={subtopic} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subtopic-${subtopic}`}
                      checked={selectedSubtopics.includes(subtopic)}
                      onCheckedChange={(checked) =>
                        handleSubtopicChange(subtopic, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`subtopic-${subtopic}`}
                      className="text-sm cursor-pointer"
                    >
                      {subtopic}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium mb-2">Difficulty</h4>
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${difficulty}`}
                    checked={selectedDifficulty.includes(difficulty)}
                    onCheckedChange={(checked) =>
                      handleDifficultyChange(difficulty, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`difficulty-${difficulty}`}
                    className="text-sm cursor-pointer capitalize"
                  >
                    {difficulty}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
