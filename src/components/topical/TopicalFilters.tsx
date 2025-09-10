import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CustomMultiSelect } from "@/components/CustomMultiSelect";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FilterOptions {
  topics: string[];
  subtopics: string[];
  syllabusObjectives: string[];
  difficulties: string[];
  questionTypes: string[];
  years: number[];
  sessions: string[];
}

interface TopicalFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableOptions: {
    topics: string[];
    subtopics: string[];
    syllabusObjectives: string[];
    questionTypes: string[];
  };
}

export const TopicalFilters: React.FC<TopicalFiltersProps> = ({
  filters,
  onFiltersChange,
  availableOptions,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    content: false,
    classification: false,
    difficulty: false,
    source: false,
  });

  const difficultyOptions = [
    { value: "easy", label: "Easy", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "hard", label: "Hard", color: "bg-red-500" },
  ];

  const yearOptions = [2025, 2024, 2023, 2022, 2021].map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const sessionOptions = [
    { value: "jan", label: "January" },
    { value: "june", label: "June" },
    { value: "oct", label: "October" },
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      topics: [],
      subtopics: [],
      syllabusObjectives: [],
      difficulties: [],
      questionTypes: [],
      years: [],
      sessions: [],
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce(
      (count, filterArray) => count + filterArray.length,
      0
    );
  };

  const updateFilter = (key: keyof FilterOptions, values: string[]) => {
    onFiltersChange({
      ...filters,
      [key]: key === "years" ? values.map(Number) : values,
    });
  };

  return (
    <Card className="w-full">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <CardTitle>Filters</CardTitle>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary">
                    {getActiveFiltersCount()} active
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getActiveFiltersCount() > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllFilters();
                    }}
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                )}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Content Filters */}
            <Collapsible
              open={expandedSections.content}
              onOpenChange={() => toggleSection("content")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <span className="font-medium">Content & Topics</span>
                  {expandedSections.content ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Topics
                  </label>
                  <CustomMultiSelect
                    options={availableOptions.topics.map((topic) => ({
                      value: topic,
                      label: topic,
                    }))}
                    selectedValues={filters.topics}
                    onSelectionChange={(values) =>
                      updateFilter("topics", values)
                    }
                    placeholder="Select topics..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Syllabus Objectives
                  </label>
                  <CustomMultiSelect
                    options={availableOptions.syllabusObjectives.map((obj) => ({
                      value: obj,
                      label: obj,
                    }))}
                    selectedValues={filters.syllabusObjectives}
                    onSelectionChange={(values) =>
                      updateFilter("syllabusObjectives", values)
                    }
                    placeholder="Select objectives..."
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Classification Filters */}
            <Collapsible
              open={expandedSections.classification}
              onOpenChange={() => toggleSection("classification")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <span className="font-medium">Question Classification</span>
                  {expandedSections.classification ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Question Types
                  </label>
                  <CustomMultiSelect
                    options={availableOptions.questionTypes.map((type) => ({
                      value: type,
                      label: type.charAt(0).toUpperCase() + type.slice(1),
                    }))}
                    selectedValues={filters.questionTypes}
                    onSelectionChange={(values) =>
                      updateFilter("questionTypes", values)
                    }
                    placeholder="Select question types..."
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Difficulty Filter */}
            <Collapsible
              open={expandedSections.difficulty}
              onOpenChange={() => toggleSection("difficulty")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <span className="font-medium">Difficulty</span>
                  {expandedSections.difficulty ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <CustomMultiSelect
                  options={difficultyOptions}
                  selectedValues={filters.difficulties}
                  onSelectionChange={(values) =>
                    updateFilter("difficulties", values)
                  }
                  placeholder="Select difficulty levels..."
                />
              </CollapsibleContent>
            </Collapsible>

            {/* Source Filters */}
            <Collapsible
              open={expandedSections.source}
              onOpenChange={() => toggleSection("source")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <span className="font-medium">Paper Source</span>
                  {expandedSections.source ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Years
                  </label>
                  <CustomMultiSelect
                    options={yearOptions}
                    selectedValues={filters.years.map(String)}
                    onSelectionChange={(values) =>
                      updateFilter("years", values)
                    }
                    placeholder="Select years..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sessions
                  </label>
                  <CustomMultiSelect
                    options={sessionOptions}
                    selectedValues={filters.sessions}
                    onSelectionChange={(values) =>
                      updateFilter("sessions", values)
                    }
                    placeholder="Select sessions..."
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
