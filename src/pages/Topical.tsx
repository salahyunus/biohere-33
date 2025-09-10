import React, { useState, useMemo } from "react";
import { BookOpen, Download, FileText, Home, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  TopicalFilters,
  FilterOptions,
} from "@/components/topical/TopicalFilters";
import { QuestionCard } from "@/components/topical/QuestionCard";
import { EnhancedExportDialog } from "@/components/topical/EnhancedExportDialog";
import {
  topicalQuestionsData,
  getAvailableTopics,
  getAvailableSyllabusObjectives,
  getAvailableQuestionTypes,
} from "@/data/topicalQuestions";

const Topical: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterOptions>({
    topics: [],
    subtopics: [],
    syllabusObjectives: [],
    difficulties: [],
    questionTypes: [],
    years: [],
    sessions: [],
  });

  const availableOptions = useMemo(
    () => ({
      topics: getAvailableTopics(),
      subtopics: [], // Will be dynamically updated based on selected topics
      syllabusObjectives: getAvailableSyllabusObjectives(),
      questionTypes: getAvailableQuestionTypes(),
    }),
    []
  );

  const filteredQuestions = useMemo(() => {
    return topicalQuestionsData.filter((question) => {
      // Filter by topics
      if (
        filters.topics.length > 0 &&
        !filters.topics.includes(question.topic)
      ) {
        return false;
      }

      // Filter by syllabus objectives
      if (
        filters.syllabusObjectives.length > 0 &&
        !filters.syllabusObjectives.includes(question.syllabusObjective)
      ) {
        return false;
      }

      // Filter by difficulties
      if (
        filters.difficulties.length > 0 &&
        !filters.difficulties.includes(question.difficulty)
      ) {
        return false;
      }

      // Filter by question types
      if (
        filters.questionTypes.length > 0 &&
        !question.questionTypes.some((type) =>
          filters.questionTypes.includes(type)
        )
      ) {
        return false;
      }

      // Filter by years
      if (filters.years.length > 0 && !filters.years.includes(question.year)) {
        return false;
      }

      // Filter by sessions
      if (
        filters.sessions.length > 0 &&
        !filters.sessions.includes(question.session)
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const exportData = {
    totalQuestions: filteredQuestions.length,
    filters:
      Object.entries(filters)
        .filter(([_, values]) => values.length > 0)
        .map(([key, values]) => `${key}: ${values.join(", ")}`)
        .join("; ") || "None",
    topics: [...new Set(filteredQuestions.map((q) => q.topic))].join(", "),
    difficulties: [...new Set(filteredQuestions.map((q) => q.difficulty))].join(
      ", "
    ),
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Layers className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Topical Questions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse and filter questions by topic, difficulty, question type, and
          more. Perfect for targeted practice and revision.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button onClick={() => navigate("/home")} variant="outline">
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
        <Button onClick={() => navigate("/past-papers")} variant="outline">
          <BookOpen className="h-4 w-4 mr-2" />
          Past Papers
        </Button>
        <EnhancedExportDialog
          questions={filteredQuestions}
          title="Topical Questions Export"
        >
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Questions
          </Button>
        </EnhancedExportDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <TopicalFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableOptions={availableOptions}
          />
        </div>

        {/* Questions List */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Questions ({filteredQuestions.length})
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredQuestions.length === topicalQuestionsData.length
                ? "Showing all questions"
                : `Filtered from ${topicalQuestionsData.length} total questions`}
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Questions Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to see more questions.
              </p>
              <Button
                onClick={() =>
                  setFilters({
                    topics: [],
                    subtopics: [],
                    syllabusObjectives: [],
                    difficulties: [],
                    questionTypes: [],
                    years: [],
                    sessions: [],
                  })
                }
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topical;
