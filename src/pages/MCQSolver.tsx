import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Home,
  Play,
  Eye,
  EyeOff,
  RotateCcw,
  ExternalLink,
  Download,
  CheckCircle,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  BookMarked,
  Settings,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BubbleSheet } from "@/components/mcq/BubbleSheet";
import { EnhancedTimer } from "@/components/mcq/EnhancedTimer";
import { MCQSettings } from "@/components/mcq/MCQSettings";
import {
  getAvailableYears,
  getAvailableSessions,
  getAnswerKey,
  getTotalQuestions,
} from "@/data/mcqAnswers";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface MCQProgress {
  paperId: string;
  year: number;
  session: string;
  answers: Record<number, string>;
  markedQuestions: Record<number, boolean>;
  timeSpent: number;
  startedAt: string;
  lastUpdated: string;
  isSubmitted: boolean;
  score?: number;
  grade?: string;
}

interface MCQSettings {
  fullWidth: boolean;
  compactMode: boolean;
  compactCircles: boolean;
  showTimer: boolean;
  timerPosition: "top-right" | "bottom-right" | "floating";
  optionLayout: "horizontal" | "vertical";
  showScrollButton: boolean;
}

const MCQSolver: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [currentPaper, setCurrentPaper] = useState<MCQProgress | null>(null);
  const [myPapers, setMyPapers] = useState<MCQProgress[]>([]);
  const [markOnSolve, setMarkOnSolve] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const [sideBySideMode, setSideBySideMode] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [currentResults, setCurrentResults] = useState<{
    score: number;
    grade: string;
    total: number;
  } | null>(null);
  const [actionsCollapsed, setActionsCollapsed] = useState(false);
  const [pdfCollapsed, setPdfCollapsed] = useState(false);
  const [timerCollapsed, setTimerCollapsed] = useState(false);

  const [settings, setSettings] = useState<MCQSettings>({
    fullWidth: true,
    compactMode: false,
    compactCircles: false,
    showTimer: true,
    timerPosition: "top-right",
    optionLayout: "horizontal",
    showScrollButton: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("mcq-solver-papers");
    if (saved) {
      setMyPapers(JSON.parse(saved));
    }

    const savedSettings = localStorage.getItem("mcq-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveProgress = (progress: MCQProgress) => {
    const updated = myPapers.filter((p) => p.paperId !== progress.paperId);
    updated.push(progress);
    setMyPapers(updated);
    localStorage.setItem("mcq-solver-papers", JSON.stringify(updated));
  };

  const saveSettings = (newSettings: MCQSettings) => {
    setSettings(newSettings);
    localStorage.setItem("mcq-settings", JSON.stringify(newSettings));
  };

  const startPaper = () => {
    if (!selectedYear || !selectedSession) {
      toast({
        title: "Selection Required",
        description: "Please select both year and session.",
        variant: "destructive",
      });
      return;
    }

    const paperId = `${selectedYear}-${selectedSession}`;
    const existingPaper = myPapers.find((p) => p.paperId === paperId);

    if (existingPaper && !existingPaper.isSubmitted) {
      setCurrentPaper(existingPaper);
    } else {
      const newPaper: MCQProgress = {
        paperId,
        year: parseInt(selectedYear),
        session: selectedSession,
        answers: {},
        markedQuestions: {},
        timeSpent: 0,
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isSubmitted: false,
      };
      setCurrentPaper(newPaper);
      saveProgress(newPaper);
    }
  };

  const handleAnswerSelect = (questionNumber: number, answer: string) => {
    if (!currentPaper || currentPaper.isSubmitted) return;

    const updatedPaper = {
      ...currentPaper,
      answers: { ...currentPaper.answers, [questionNumber]: answer },
      lastUpdated: new Date().toISOString(),
    };

    // Handle mark-on-solve
    if (markOnSolve) {
      const correctAnswer = getAnswerKey(
        currentPaper.year,
        currentPaper.session
      )[questionNumber - 1];
      const isCorrect = answer === correctAnswer;

      updatedPaper.markedQuestions = {
        ...updatedPaper.markedQuestions,
        [questionNumber]: true,
      };

      toast({
        title: isCorrect ? "Correct!" : "Incorrect",
        description: isCorrect
          ? "Well done!"
          : `Correct answer is ${correctAnswer}`,
        variant: isCorrect ? "default" : "destructive",
        duration: 2000,
      });
    }

    setCurrentPaper(updatedPaper);
    saveProgress(updatedPaper);
  };

  const submitPaper = () => {
    if (!currentPaper) return;

    const correctAnswers = getAnswerKey(
      currentPaper.year,
      currentPaper.session
    );
    const totalQuestions = getTotalQuestions(
      currentPaper.year,
      currentPaper.session
    );

    let score = 0;
    Object.entries(currentPaper.answers).forEach(([q, answer]) => {
      if (correctAnswers[parseInt(q) - 1] === answer) {
        score++;
      }
    });

    const percentage = (score / totalQuestions) * 100;
    const grade = getGrade(percentage);

    const submittedPaper = {
      ...currentPaper,
      isSubmitted: true,
      score,
      grade,
      lastUpdated: new Date().toISOString(),
    };

    setCurrentPaper(submittedPaper);
    saveProgress(submittedPaper);

    setCurrentResults({ score, grade, total: totalQuestions });
    setShowResultDialog(true);
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 80) return "A*";
    if (percentage >= 70) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "U";
  };

  const resetProgress = () => {
    if (!currentPaper) return;

    const resetPaper = {
      ...currentPaper,
      answers: {},
      markedQuestions: {},
      isSubmitted: false,
      score: undefined,
      grade: undefined,
      lastUpdated: new Date().toISOString(),
    };

    setCurrentPaper(resetPaper);
    saveProgress(resetPaper);
    setRevealAll(false);
  };

  const handleRevealAll = () => {
    setRevealAll(true);
  };

  const exportResults = () => {
    if (!currentResults || !currentPaper) return;

    const pdf = new jsPDF();
    const { score, grade, total } = currentResults;
    const percentage = Math.round((score / total) * 100);

    pdf.setFontSize(20);
    pdf.text("MCQ Test Results", 20, 30);

    pdf.setFontSize(14);
    pdf.text(`Paper: ${currentPaper.year} ${currentPaper.session}`, 20, 50);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 65);

    pdf.setFontSize(16);
    pdf.text(`Score: ${score}/${total} (${percentage}%)`, 20, 90);
    pdf.text(`Grade: ${grade}`, 20, 110);

    const correctAnswers = getAnswerKey(
      currentPaper.year,
      currentPaper.session
    );
    let yPos = 140;

    pdf.setFontSize(12);
    pdf.text("Question Breakdown:", 20, yPos);
    yPos += 20;

    Object.entries(currentPaper.answers).forEach(([q, answer]) => {
      const questionNum = parseInt(q);
      const correct = correctAnswers[questionNum - 1] === answer;
      const status = correct ? "✓" : "✗";
      const correctAns = correctAnswers[questionNum - 1];

      pdf.text(
        `Q${questionNum}: Your answer: ${answer} ${status} ${
          !correct ? `(Correct: ${correctAns})` : ""
        }`,
        20,
        yPos
      );
      yPos += 10;

      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
    });

    pdf.save(`mcq-results-${currentPaper.paperId}.pdf`);
  };

  const getSamplePDFUrl = () => {
    return "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";
  };

  const handleResultDialogClose = () => {
    setShowResultDialog(false);
    // Auto-scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const renderPaperSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">MCQ Solver</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Practice with past paper MCQs using our smart bubble sheet system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Paper</CardTitle>
          <CardDescription>
            Choose a year and session to start practicing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
      {myPapers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No papers attempted yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {myPapers.map((paper) => (
            <Card key={paper.paperId}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {paper.year} {paper.session} Paper
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Started: {new Date(paper.startedAt).toLocaleDateString()}
                    </p>
                    {paper.isSubmitted && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          Score: {paper.score}/
                          {getTotalQuestions(paper.year, paper.session)}
                        </Badge>
                        <Badge
                          variant={
                            paper.grade === "A*" || paper.grade === "A"
                              ? "default"
                              : "outline"
                          }
                        >
                          Grade: {paper.grade}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPaper(paper)}
                    >
                      {paper.isSubmitted ? "Review" : "Continue"}
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
    if (!currentPaper) return null;

    const totalQuestions = getTotalQuestions(
      currentPaper.year,
      currentPaper.session
    );
    const correctAnswers = getAnswerKey(
      currentPaper.year,
      currentPaper.session
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {currentPaper.year} {currentPaper.session} Paper
            </h1>
            <p className="text-muted-foreground">
              MCQ Practice - {totalQuestions} questions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setCurrentPaper(null)}>
              <Home className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
          </div>
        </div>

        {/* Actions Bar */}
        <Collapsible
          open={!actionsCollapsed}
          onOpenChange={(open) => setActionsCollapsed(!open)}
        >
          <Card>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4">
                <span className="font-medium">Controls & Settings</span>
                {actionsCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap items-center gap-4">
                  <MCQSettings
                    settings={settings}
                    onSettingsChange={saveSettings}
                  />

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="mark-on-solve"
                      checked={markOnSolve}
                      onCheckedChange={setMarkOnSolve}
                      disabled={currentPaper.isSubmitted}
                    />
                    <Label htmlFor="mark-on-solve">Mark on solve</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="side-by-side"
                      checked={sideBySideMode}
                      onCheckedChange={setSideBySideMode}
                    />
                    <Label htmlFor="side-by-side">Side by side with PDF</Label>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        {revealAll ? "Hide" : "Reveal"} All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reveal All Answers?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will show all correct answers on the answer
                          sheet. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRevealAll}>
                          Yes, Reveal All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Progress
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Progress?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will clear all your answers and progress for this
                          paper. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={resetProgress}>
                          Yes, Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getSamplePDFUrl(), "_blank")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Open QP
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getSamplePDFUrl(), "_blank")}
                  >
                    <BookMarked className="h-4 w-4 mr-2" />
                    Open MS
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-timer"
                      checked={settings.showTimer}
                      onCheckedChange={(checked) =>
                        saveSettings({ ...settings, showTimer: checked })
                      }
                    />
                    <Label htmlFor="show-timer">Show Timer</Label>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Main Interface */}
        <div
          className={
            sideBySideMode ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""
          }
        >
          <BubbleSheet
            totalQuestions={totalQuestions}
            answers={currentPaper.answers}
            correctAnswers={
              revealAll || currentPaper.isSubmitted ? correctAnswers : undefined
            }
            onAnswerSelect={handleAnswerSelect}
            isSubmitted={currentPaper.isSubmitted}
            showResults={revealAll || currentPaper.isSubmitted}
            fullWidth={settings.fullWidth}
            compactMode={settings.compactMode}
            compactCircles={settings.compactCircles}
            optionLayout={settings.optionLayout}
            markOnSolve={markOnSolve}
            markedQuestions={currentPaper.markedQuestions}
            showScrollButton={settings.showScrollButton}
          />

          {sideBySideMode && (
            <Collapsible
              open={!pdfCollapsed}
              onOpenChange={(open) => setPdfCollapsed(!open)}
            >
              <Card className="h-fit lg:sticky lg:top-4">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4"
                  >
                    <span className="font-medium">Question Paper PDF</span>
                    {pdfCollapsed ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-4 pt-0">
                    <iframe
                      src={getSamplePDFUrl()}
                      className="w-full h-[600px] border rounded"
                      title="Question Paper PDF"
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}
        </div>

        {/* Results Section */}
        <div ref={resultsRef} />

        {/* Submit Button */}
        {!currentPaper.isSubmitted && (
          <div className="flex justify-center">
            <Button onClick={submitPaper} size="lg">
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Paper
            </Button>
          </div>
        )}

        {/* Timer */}
        {settings.showTimer && (
          <EnhancedTimer
            duration={75}
            position={settings.timerPosition}
            isCollapsed={timerCollapsed}
            onCollapsedChange={setTimerCollapsed}
            onTimeUp={() => {
              toast({
                title: "Time's Up!",
                description: "Your time is up. Consider submitting your paper.",
                variant: "destructive",
              });
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in max-w-7xl mx-auto">
      {/* Navigation */}
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

      {currentPaper ? (
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

      {/* Results Dialog */}
      <Dialog open={showResultDialog} onOpenChange={handleResultDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Paper Completed!
            </DialogTitle>
            <DialogDescription>Here are your results</DialogDescription>
          </DialogHeader>

          {currentResults && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {currentResults.grade}
                </div>
                <div className="text-xl">
                  {currentResults.score}/{currentResults.total}
                </div>
                <div className="text-muted-foreground">
                  {Math.round(
                    (currentResults.score / currentResults.total) * 100
                  )}
                  %
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleResultDialogClose}>
              View Results
            </Button>
            <Button onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCQSolver;
