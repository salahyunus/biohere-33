import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  BookOpen,
  Clock,
  Shuffle,
  RotateCcw,
  Eye,
  EyeOff,
  Download,
  Settings,
} from "lucide-react";
import { QuizFilters } from "./QuizFilters";
import { QuizQuestion } from "./QuizQuestion";
import {
  QuizFilters as QuizFiltersType,
  GeneratedQuiz,
  generateQuiz,
  SavedQuestion,
} from "@/data/quizQuestions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface QuizGeneratorProps {
  onSaveQuiz: (quiz: GeneratedQuiz) => void;
  onSaveQuestion: (question: SavedQuestion) => void;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  onSaveQuiz,
  onSaveQuestion,
}) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<QuizFiltersType>({
    yearRange: { start: 2020, end: 2025 },
    sessions: [],
    difficulties: [],
    topics: [],
    subtopics: [],
    questionTypes: [],
    includeImages: true,
    totalMarks: 90,
  });

  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(
    null
  );
  const [quizName, setQuizName] = useState("");
  const [displayMode, setDisplayMode] = useState<"static" | "play" | "exam">(
    "static"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState<Set<string>>(new Set());
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [neverShowAnswers, setNeverShowAnswers] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});

  const handleGenerateQuiz = () => {
    if (!quizName.trim()) {
      toast({
        title: "Quiz Name Required",
        description: "Please enter a name for your quiz.",
        variant: "destructive",
      });
      return;
    }

    const quiz = generateQuiz(filters, quizName);
    setGeneratedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setCurrentPage(0);
    setVisibleAnswers(new Set());
    setShowAllAnswers(false);
    setMcqAnswers({});

    toast({
      title: "Quiz Generated!",
      description: `Created "${quiz.name}" with ${quiz.questions.length} questions (${quiz.totalMarks} marks)`,
    });
  };

  const shuffleQuestions = () => {
    if (!generatedQuiz) return;

    const shuffled = [...generatedQuiz.questions].sort(
      () => Math.random() - 0.5
    );
    setGeneratedQuiz({ ...generatedQuiz, questions: shuffled });
    setCurrentQuestionIndex(0);
    setCurrentPage(0);

    toast({
      title: "Questions Shuffled",
      description: "The order of questions has been randomized.",
    });
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setCurrentPage(0);
    setVisibleAnswers(new Set());
    setShowAllAnswers(false);
    setTimeElapsed(0);
    setTimerRunning(false);
    setMcqAnswers({});

    toast({
      title: "Quiz Reset",
      description: "Quiz has been reset to the beginning.",
    });
  };

  const toggleAnswer = (questionId: string) => {
    const newVisible = new Set(visibleAnswers);
    if (newVisible.has(questionId)) {
      newVisible.delete(questionId);
    } else {
      newVisible.add(questionId);
    }
    setVisibleAnswers(newVisible);
  };

  const toggleAllAnswers = () => {
    if (showAllAnswers) {
      setVisibleAnswers(new Set());
      setShowAllAnswers(false);
    } else {
      const allIds = new Set(generatedQuiz?.questions.map((q) => q.id) || []);
      setVisibleAnswers(allIds);
      setShowAllAnswers(true);
    }
  };

  const handleSaveQuestion = (question: any) => {
    const savedQuestion: SavedQuestion = {
      ...question,
      savedAt: new Date().toISOString(),
      tags: [],
      isImportant: false,
    };
    onSaveQuestion(savedQuestion);

    toast({
      title: "Question Saved",
      description: "Question has been added to your saved questions.",
    });
  };

  const handleSaveQuiz = () => {
    if (generatedQuiz) {
      onSaveQuiz(generatedQuiz);
      toast({
        title: "Quiz Saved",
        description: `"${generatedQuiz.name}" has been saved to your collection.`,
      });
    }
  };

  const renderStaticMode = () => {
    if (!generatedQuiz) return null;

    return (
      <div className="space-y-4">
        {generatedQuiz.questions.map((question) => (
          <QuizQuestion
            key={question.id}
            question={question}
            showAnswer={showAllAnswers || visibleAnswers.has(question.id)}
            onToggleAnswer={() => toggleAnswer(question.id)}
            onSaveQuestion={handleSaveQuestion}
            onAddComment={() => {}}
            onToggleImportant={() => {}}
            isAnswerMode={neverShowAnswers}
            selectedAnswer={mcqAnswers[question.id]}
            onAnswerSelect={(answer) =>
              setMcqAnswers((prev) => ({ ...prev, [question.id]: answer }))
            }
          />
        ))}
      </div>
    );
  };

  const renderPlayMode = () => {
    if (!generatedQuiz || generatedQuiz.questions.length === 0) return null;

    const currentQuestion = generatedQuiz.questions[currentQuestionIndex];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of{" "}
            {generatedQuiz.questions.length}
          </Badge>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {Math.floor(timeElapsed / 60)}:
              {(timeElapsed % 60).toString().padStart(2, "0")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTimerRunning(!timerRunning)}
            >
              {timerRunning ? "Pause" : "Start"}
            </Button>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / generatedQuiz.questions.length) *
                100
              }%`,
            }}
          />
        </div>

        <QuizQuestion
          question={currentQuestion}
          showAnswer={showAllAnswers || visibleAnswers.has(currentQuestion.id)}
          onToggleAnswer={() => toggleAnswer(currentQuestion.id)}
          onSaveQuestion={handleSaveQuestion}
          onAddComment={() => {}}
          onToggleImportant={() => {}}
          isCollapsible={false}
          isAnswerMode={neverShowAnswers}
          selectedAnswer={mcqAnswers[currentQuestion.id]}
          onAnswerSelect={(answer) =>
            setMcqAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
          }
        />

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Progress: {currentQuestionIndex + 1}/
              {generatedQuiz.questions.length}
            </span>
          </div>

          <Button
            onClick={() =>
              setCurrentQuestionIndex(
                Math.min(
                  generatedQuiz.questions.length - 1,
                  currentQuestionIndex + 1
                )
              )
            }
            disabled={
              currentQuestionIndex === generatedQuiz.questions.length - 1
            }
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const renderExamMode = () => {
    if (!generatedQuiz) return null;

    const startIndex = currentPage * questionsPerPage;
    const endIndex = Math.min(
      startIndex + questionsPerPage,
      generatedQuiz.questions.length
    );
    const pageQuestions = generatedQuiz.questions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(
      generatedQuiz.questions.length / questionsPerPage
    );

    return (
      <div className="space-y-6">
        {currentPage === 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Exam Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">
                    {generatedQuiz.questions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {generatedQuiz.totalMarks}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Marks
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {generatedQuiz.estimatedTime}
                  </div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Page {currentPage + 1} of {totalPages}
          </Badge>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {Math.floor(timeElapsed / 60)}:
              {(timeElapsed % 60).toString().padStart(2, "0")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTimerRunning(!timerRunning)}
            >
              {timerRunning ? "Pause" : "Start"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {pageQuestions.map((question) => (
            <QuizQuestion
              key={question.id}
              question={question}
              showAnswer={showAllAnswers || visibleAnswers.has(question.id)}
              onToggleAnswer={() => toggleAnswer(question.id)}
              onSaveQuestion={handleSaveQuestion}
              onAddComment={() => {}}
              onToggleImportant={() => {}}
              isCollapsible={false}
              isAnswerMode={neverShowAnswers}
              selectedAnswer={mcqAnswers[question.id]}
              onAnswerSelect={(answer) =>
                setMcqAnswers((prev) => ({ ...prev, [question.id]: answer }))
              }
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Previous Page
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Questions {startIndex + 1}-{endIndex} of{" "}
              {generatedQuiz.questions.length}
            </span>
          </div>

          <Button
            onClick={() =>
              setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Next Page
          </Button>
        </div>
      </div>
    );
  };

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  return (
    <div className="space-y-6">
      {!generatedQuiz ? (
        <>
          <div className="space-y-4">
            <div>
              <Label htmlFor="quiz-name">Quiz Name</Label>
              <Input
                id="quiz-name"
                placeholder="Enter quiz name..."
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <QuizFilters filters={filters} onFiltersChange={setFilters} />

          <div className="text-center">
            <Button onClick={handleGenerateQuiz} size="lg" className="min-w-48">
              <Play className="h-5 w-5 mr-2" />
              Generate Quiz
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{generatedQuiz.name}</h2>
              <p className="text-muted-foreground">
                {generatedQuiz.questions.length} questions •{" "}
                {generatedQuiz.totalMarks} marks • ~
                {generatedQuiz.estimatedTime} minutes
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={displayMode}
                onValueChange={(value: any) => setDisplayMode(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static List</SelectItem>
                  <SelectItem value="play">Play Mode</SelectItem>
                  <SelectItem value="exam">Exam Mode</SelectItem>
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Quiz Settings</DialogTitle>
                    <DialogDescription>
                      Customize your quiz experience
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Never show answers (Exam mode)</Label>
                      <Switch
                        checked={neverShowAnswers}
                        onCheckedChange={setNeverShowAnswers}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={shuffleQuestions}>
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>

            <Button variant="outline" size="sm" onClick={resetQuiz}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>

            {!neverShowAnswers && (
              <Button variant="outline" size="sm" onClick={toggleAllAnswers}>
                {showAllAnswers ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {showAllAnswers ? "Hide All" : "Show All"} Answers
              </Button>
            )}

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>

            <Button onClick={handleSaveQuiz}>
              <BookOpen className="h-4 w-4 mr-2" />
              Save Quiz
            </Button>
          </div>

          {displayMode === "static" && renderStaticMode()}
          {displayMode === "play" && renderPlayMode()}
          {displayMode === "exam" && renderExamMode()}
        </>
      )}
    </div>
  );
};
