import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  QuizFilters as QuizFiltersType,
  quizTopics,
} from "@/data/quizQuestions";

interface QuizFiltersProps {
  filters: QuizFiltersType;
  onFiltersChange: (filters: QuizFiltersType) => void;
}

export const QuizFilters: React.FC<QuizFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const sessionOptions = ["jan", "june", "oct"];
  const difficultyOptions = ["easy", "medium", "hard"];
  const questionTypeOptions = [
    { id: "all", label: "All Question Types" },
    { id: "mcq", label: "Multiple Choice (MCQ)" },
    { id: "6-marker", label: "Long Questions (6+ marks)" },
    { id: "labelling", label: "Labelling" },
    { id: "calculation", label: "Calculations" },
    { id: "definition", label: "Definitions" },
    { id: "explanation", label: "Explanations" },
    { id: "diagram", label: "Diagrams" },
  ];

  const updateFilters = (updates: Partial<QuizFiltersType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleTopic = (topicName: string) => {
    const newTopics = filters.topics.includes(topicName)
      ? filters.topics.filter((t) => t !== topicName)
      : [...filters.topics, topicName];

    // If deselecting topic, also deselect its subtopics
    if (!newTopics.includes(topicName)) {
      const topic = quizTopics.find((t) => t.name === topicName);
      if (topic) {
        const subtopicsToRemove = topic.subtopics.map((st) => st.name);
        const newSubtopics = filters.subtopics.filter(
          (st) => !subtopicsToRemove.includes(st)
        );
        updateFilters({ topics: newTopics, subtopics: newSubtopics });
        return;
      }
    }

    updateFilters({ topics: newTopics });
  };

  const toggleSubtopic = (subtopicName: string) => {
    const newSubtopics = filters.subtopics.includes(subtopicName)
      ? filters.subtopics.filter((st) => st !== subtopicName)
      : [...filters.subtopics, subtopicName];
    updateFilters({ subtopics: newSubtopics });
  };

  const toggleTopicExpansion = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const clearAllFilters = () => {
    updateFilters({
      yearRange: { start: 2020, end: 2025 },
      sessions: [],
      difficulties: [],
      topics: [],
      subtopics: [],
      questionTypes: [],
      includeImages: true,
      totalMarks: 90,
    });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.sessions.length +
      filters.difficulties.length +
      filters.topics.length +
      filters.subtopics.length +
      filters.questionTypes.length
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quiz Settings & Filters</CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear All ({getActiveFiltersCount()})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Year Range */}
        <div className="space-y-2">
          <Label>Year Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={filters.yearRange.start}
              onChange={(e) =>
                updateFilters({
                  yearRange: {
                    ...filters.yearRange,
                    start: parseInt(e.target.value) || 2020,
                  },
                })
              }
              min={2015}
              max={2025}
              className="w-24"
            />
            <span>to</span>
            <Input
              type="number"
              value={filters.yearRange.end}
              onChange={(e) =>
                updateFilters({
                  yearRange: {
                    ...filters.yearRange,
                    end: parseInt(e.target.value) || 2025,
                  },
                })
              }
              min={2015}
              max={2025}
              className="w-24"
            />
          </div>
        </div>

        {/* Total Marks */}
        <div className="space-y-2">
          <Label>Total Marks Target</Label>
          <Input
            type="number"
            value={filters.totalMarks}
            onChange={(e) =>
              updateFilters({ totalMarks: parseInt(e.target.value) || 90 })
            }
            min={30}
            max={150}
            step={10}
            className="w-32"
          />
        </div>

        {/* Sessions */}
        <div className="space-y-2">
          <Label>Sessions</Label>
          <div className="flex flex-wrap gap-2">
            {sessionOptions.map((session) => (
              <Badge
                key={session}
                variant={
                  filters.sessions.includes(session) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  const newSessions = filters.sessions.includes(session)
                    ? filters.sessions.filter((s) => s !== session)
                    : [...filters.sessions, session];
                  updateFilters({ sessions: newSessions });
                }}
              >
                {session.charAt(0).toUpperCase() + session.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((difficulty) => (
              <Badge
                key={difficulty}
                variant={
                  filters.difficulties.includes(difficulty as any)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  const newDifficulties = filters.difficulties.includes(
                    difficulty as any
                  )
                    ? filters.difficulties.filter((d) => d !== difficulty)
                    : [...filters.difficulties, difficulty as any];
                  updateFilters({ difficulties: newDifficulties });
                }}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-2">
          <Label>Topics</Label>
          <div className="space-y-2">
            {quizTopics.map((topic) => (
              <div key={topic.id} className="border rounded-md p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.topics.includes(topic.name)}
                      onCheckedChange={() => toggleTopic(topic.name)}
                    />
                    <Label className="font-medium">{topic.name}</Label>
                    <Badge variant="outline" className="text-xs">
                      {topic.subtopics.reduce(
                        (sum, st) => sum + st.questionCount,
                        0
                      )}{" "}
                      questions
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTopicExpansion(topic.id)}
                  >
                    {expandedTopics.has(topic.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <Collapsible open={expandedTopics.has(topic.id)}>
                  <CollapsibleContent className="mt-2 ml-6 space-y-1">
                    {topic.subtopics.map((subtopic) => (
                      <div
                        key={subtopic.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={filters.subtopics.includes(subtopic.name)}
                          onCheckedChange={() => toggleSubtopic(subtopic.name)}
                        />
                        <Label className="text-sm">{subtopic.name}</Label>
                        <Badge variant="outline" className="text-xs">
                          {subtopic.questionCount}
                        </Badge>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>

        {/* Question Types */}
        <div className="space-y-2">
          <Label>Question Types</Label>
          <div className="grid grid-cols-2 gap-2">
            {questionTypeOptions.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={
                    type.id === "all"
                      ? filters.questionTypes.length === 0
                      : filters.questionTypes.includes(type.id)
                  }
                  onCheckedChange={() => {
                    if (type.id === "all") {
                      updateFilters({ questionTypes: [] });
                    } else {
                      const newTypes = filters.questionTypes.includes(type.id)
                        ? filters.questionTypes.filter((qt) => qt !== type.id)
                        : [...filters.questionTypes, type.id];
                      updateFilters({ questionTypes: newTypes });
                    }
                  }}
                />
                <Label className="text-sm">{type.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-2">
          <Label>Additional Options</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={filters.includeImages}
              onCheckedChange={(checked) =>
                updateFilters({ includeImages: checked as boolean })
              }
            />
            <Label>Include questions with images</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
