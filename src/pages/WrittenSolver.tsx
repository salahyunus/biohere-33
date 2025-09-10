import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Home, Play, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getAvailableYears,
  getAvailableSessions,
  getWrittenPaper,
  WrittenPaper,
  WrittenProgress,
} from "@/data/writtenPapers";
import { useWrittenSolver } from "@/hooks/useWrittenSolver";
import { WrittenTimer } from "@/components/written/WrittenTimer";
import { QuestionInterface } from "@/components/written/QuestionInterface";
import { ExamView } from "@/components/written/ExamView";
import { ResultsCard } from "@/components/written/ResultsCard";
import { ControlsBar } from "@/components/written/ControlsBar";
import { useToast } from "@/hooks/use-toast";
import { ReviewMode } from "@/components/written/ReviewMode";

const WrittenSolver: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    progressData,
    getProgress,
    createNewProgress,
    saveProgress,
    submitAnswer,
    submitAllAnswers,
    resetAnswer,
  } = useWrittenSolver();

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [currentPaper, setCurrentPaper] = useState<WrittenPaper | null>(null);
  const [currentProgress, setCurrentProgress] =
    useState<WrittenProgress | null>(null);
  const [revealAll, setRevealAll] = useState(false);
  const [submissionMode, setSubmissionMode] = useState<
    "question-by-question" | "submit-at-end"
  >("question-by-question");
  const [viewMode, setViewMode] = useState<"play-mode" | "exam-view">(
    "play-mode"
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [questionsPerPage] = useState(3);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(true);

  const getSamplePDFUrl = () =>
    "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";

  const startPaper = () => {
    if (!selectedYear || !selectedSession) {
      toast({
        title: "Selection Required",
        description: "Please select both year and session.",
        variant: "destructive",
      });
      return;
    }

    const paper = getWrittenPaper(parseInt(selectedYear), selectedSession);
    if (!paper) {
      toast({
        title: "Paper Not Found",
        description: "The selected paper is not available.",
        variant: "destructive",
      });
      return;
    }

    const existingProgress = getProgress(paper.id);
    if (existingProgress && !existingProgress.isCompleted) {
      setCurrentPaper(paper);
      setCurrentProgress(existingProgress);
      setViewMode(existingProgress.viewMode);
      setSubmissionMode(existingProgress.submissionMode);
    } else {
      const newProgress = createNewProgress(paper, submissionMode, viewMode);
      setCurrentPaper(paper);
      setCurrentProgress(newProgress);
      saveProgress(newProgress);
    }
    setTimerRunning(true);
    setIsTimerVisible(true);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    if (!currentProgress) return;

    const updatedProgress = {
      ...currentProgress,
      answers: {
        ...currentProgress.answers,
        [questionId]: {
          ...currentProgress.answers[questionId],
          answer,
        },
      },
      lastUpdated: new Date().toISOString(),
    };

    setCurrentProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const handleSubmitAnswer = (questionId: string) => {
    if (!currentPaper || !currentProgress) return;

    const question = currentPaper.questions.find((q) => q.id === questionId);
    if (!question) return;

    const userAnswer = currentProgress.answers[questionId];
    const updatedProgress = submitAnswer(
      currentProgress,
      questionId,
      userAnswer.answer,
      question
    );
    setCurrentProgress(updatedProgress);

    toast({
      title: "Answer Submitted",
      description: `Scored ${updatedProgress.answers[questionId].marksAwarded}/${question.totalMarks} marks`,
      duration: 3000,
    });
  };

  const handleResetAnswer = (questionId: string) => {
    if (!currentProgress) return;

    const updatedProgress = resetAnswer(currentProgress, questionId);
    setCurrentProgress(updatedProgress);

    toast({
      title: "Answer Reset",
      description: "Answer has been cleared and can be resubmitted.",
      duration: 2000,
    });
  };

  const handleNextQuestion = () => {
    if (!currentProgress || !currentPaper) return;

    const nextIndex = currentProgress.currentQuestionIndex + 1;
    if (nextIndex >= currentPaper.questions.length) {
      if (currentProgress.submissionMode === "question-by-question") {
        handleSubmitAllAnswers();
      }
      return;
    }

    const updatedProgress = {
      ...currentProgress,
      currentQuestionIndex: nextIndex,
      lastUpdated: new Date().toISOString(),
    };

    setCurrentProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const handleSubmitAllAnswers = () => {
    if (!currentPaper || !currentProgress) return;

    const updatedProgress = submitAllAnswers(currentProgress, currentPaper);
    setCurrentProgress(updatedProgress);
    setTimerRunning(false);
    setRevealAll(true);

    // Calculate total score
    const totalScore = Object.values(updatedProgress.answers).reduce(
      (sum, answer) => sum + (answer.marksAwarded || 0),
      0
    );

    toast({
      title: "Paper Completed!",
      description: `Total Score: ${totalScore}/${currentPaper.totalMarks}`,
      duration: 5000,
    });
  };

  const handleRevealAll = () => {
    setRevealAll(true);
    toast({
      title: "All Answers Revealed",
      description: "Model answers are now visible for all questions.",
      duration: 3000,
    });
  };

  const resetPaper = () => {
    if (!currentPaper) return;

    const newProgress = createNewProgress(
      currentPaper,
      submissionMode,
      viewMode
    );
    setCurrentProgress(newProgress);
    saveProgress(newProgress);
    setRevealAll(false);
    setCurrentPage(0);
    setTimerRunning(true);

    toast({
      title: "Paper Reset",
      description: "All progress has been cleared.",
      duration: 3000,
    });
  };

  const handleViewModeChange = (newMode: "play-mode" | "exam-view") => {
    if (!currentProgress) return;

    setViewMode(newMode);
    const updatedProgress = {
      ...currentProgress,
      viewMode: newMode,
      lastUpdated: new Date().toISOString(),
    };
    setCurrentProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const handleSubmissionModeChange = (
    newMode: "question-by-question" | "submit-at-end"
  ) => {
    if (!currentProgress) return;

    setSubmissionMode(newMode);
    const updatedProgress = {
      ...currentProgress,
      submissionMode: newMode,
      lastUpdated: new Date().toISOString(),
    };
    setCurrentProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const renderPaperSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Written Solver</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Practice with past paper written questions and get instant feedback on
          your answers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Paper</CardTitle>
          <CardDescription>
            Choose a year and session to start practicing
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-fade-in space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableYears().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Session</Label>
              <Select
                value={selectedSession}
                onValueChange={setSelectedSession}
                disabled={!selectedYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {selectedYear &&
                    getAvailableSessions(parseInt(selectedYear)).map(
                      (session) => (
                        <SelectItem key={session} value={session}>
                          {session.charAt(0).toUpperCase() + session.slice(1)}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Submission Mode</Label>
                <Select
                  value={submissionMode}
                  onValueChange={(value: any) => setSubmissionMode(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="question-by-question">
                      Submit Each Question
                    </SelectItem>
                    <SelectItem value="submit-at-end">
                      Submit All at End
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>View Mode</Label>
                <Select
                  value={viewMode}
                  onValueChange={(value: any) => setViewMode(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="play-mode">
                      Question by Question
                    </SelectItem>
                    <SelectItem value="exam-view">
                      Exam View (Multiple per page)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={startPaper} size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start Paper
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMyPapers = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Papers</h2>
      {progressData.length === 0 ? (
        <Card>
          <CardContent className="animate-fade-in text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No papers attempted yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {progressData.map((progress) => (
            <Card key={progress.paperId}>
              <CardContent className="p-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {progress.year} {progress.session} Paper
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Started:{" "}
                      {new Date(progress.startedAt).toLocaleDateString()}
                    </p>
                    {progress.isCompleted && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          Score: {progress.totalMarksAwarded}/70
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const paper = getWrittenPaper(
                          progress.year,
                          progress.session
                        );
                        if (paper) {
                          setCurrentPaper(paper);
                          setCurrentProgress(progress);
                          setViewMode(progress.viewMode);
                          setSubmissionMode(progress.submissionMode);
                          setRevealAll(progress.isCompleted);
                        }
                      }}
                    >
                      {progress.isCompleted ? "Review" : "Continue"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderSolvingInterface = () => {
    if (!currentPaper || !currentProgress) return null;

    const currentQuestion =
      currentPaper.questions[currentProgress.currentQuestionIndex];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {currentPaper.year} {currentPaper.session} Paper{" "}
              {currentPaper.paperNumber}
            </h1>
            <p className="text-muted-foreground">
              Written Practice - {currentPaper.questions.length} questions -{" "}
              {currentPaper.duration} minutes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setCurrentPaper(null)}>
              <Home className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
          </div>
        </div>

        {/* Controls Bar */}
        <ControlsBar
          progress={currentProgress}
          isTimerVisible={isTimerVisible}
          onShowTimer={() => setIsTimerVisible(true)}
          onRevealAll={handleRevealAll}
          onResetPaper={resetPaper}
          onViewModeChange={handleViewModeChange}
          onSubmissionModeChange={handleSubmissionModeChange}
          getSamplePDFUrl={getSamplePDFUrl}
        />

        {/* Main Content */}
        {currentProgress.isCompleted ? (
          <div className="space-y-6">
            <ResultsCard paper={currentPaper} progress={currentProgress} />

            {/* Review Mode */}
            <Card>
              <CardHeader>
                <CardTitle>Review Your Answers</CardTitle>
                <CardDescription>
                  Navigate through all questions to review your answers and see
                  the model answers
                </CardDescription>
              </CardHeader>
              <CardContent className="animate-fade-in">
                <ReviewMode paper={currentPaper} progress={currentProgress} />
              </CardContent>
            </Card>
          </div>
        ) : viewMode === "exam-view" ? (
          <ExamView
            questions={currentPaper.questions}
            progress={currentProgress}
            currentPage={currentPage}
            questionsPerPage={questionsPerPage}
            onAnswerChange={handleAnswerChange}
            onPrevPage={() => setCurrentPage(Math.max(0, currentPage - 1))}
            onNextPage={() => setCurrentPage(currentPage + 1)}
            onSubmitAll={handleSubmitAllAnswers}
            isLastPage={
              (currentPage + 1) * questionsPerPage >=
              currentPaper.questions.length
            }
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prevIndex = Math.max(
                    0,
                    currentProgress.currentQuestionIndex - 1
                  );
                  setCurrentProgress({
                    ...currentProgress,
                    currentQuestionIndex: prevIndex,
                  });
                }}
                disabled={currentProgress.currentQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <Badge variant="outline">
                Question {currentProgress.currentQuestionIndex + 1} of{" "}
                {currentPaper.questions.length}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextIndex = Math.min(
                    currentPaper.questions.length - 1,
                    currentProgress.currentQuestionIndex + 1
                  );
                  setCurrentProgress({
                    ...currentProgress,
                    currentQuestionIndex: nextIndex,
                  });
                }}
                disabled={
                  currentProgress.currentQuestionIndex ===
                  currentPaper.questions.length - 1
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <QuestionInterface
              question={currentQuestion}
              userAnswer={currentProgress.answers[currentQuestion.id]}
              progress={currentProgress}
              showModelAnswer={revealAll}
              onAnswerChange={(answer) =>
                handleAnswerChange(currentQuestion.id, answer)
              }
              onSubmit={() => handleSubmitAnswer(currentQuestion.id)}
              onReset={() => handleResetAnswer(currentQuestion.id)}
              onNext={handleNextQuestion}
              onSubmitAll={handleSubmitAllAnswers}
              canSubmit={true}
              isLastQuestion={
                currentProgress.currentQuestionIndex ===
                currentPaper.questions.length - 1
              }
            />
          </>
        )}

        {/* Timer */}
        {isTimerVisible && (
          <WrittenTimer
            duration={currentPaper.duration}
            onTimeUp={() => {
              toast({
                title: "Time's Up!",
                description: "The exam time has ended.",
                variant: "destructive",
              });
            }}
            isRunning={timerRunning}
            onToggle={setTimerRunning}
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex gap-4 mb-6">
        <Button onClick={() => navigate("/home")} variant="outline">
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
        <Button onClick={() => navigate("/past-papers")} variant="outline">
          <BookOpen className="h-4 w-4 mr-2" />
          Past Papers
        </Button>
      </div>

      {currentPaper && currentProgress ? (
        renderSolvingInterface()
      ) : (
        <Tabs defaultValue="select" className="space-y-6">
          <TabsList>
            <TabsTrigger value="select">Select Paper</TabsTrigger>
            <TabsTrigger value="my-papers">My Papers</TabsTrigger>
          </TabsList>

          <TabsContent value="select">{renderPaperSelection()}</TabsContent>

          <TabsContent value="my-papers">{renderMyPapers()}</TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default WrittenSolver;
