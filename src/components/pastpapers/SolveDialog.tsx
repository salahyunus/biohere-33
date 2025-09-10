import React, { useState } from "react";
import { Clock, Trophy, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { usePastPapers, type PastPaper } from "@/hooks/usePastPapers";
import { useFolders } from "@/hooks/useFolders";
import { useToast } from "@/hooks/use-toast";

interface SolveDialogProps {
  paper: PastPaper;
  onClose: () => void;
}

export const SolveDialog: React.FC<SolveDialogProps> = ({ paper, onClose }) => {
  const [score, setScore] = useState(paper.solvedInfo?.score?.toString() || "");
  const [totalMarks, setTotalMarks] = useState(
    paper.solvedInfo?.totalMarks?.toString() ||
      paper.questions.reduce((sum, q) => sum + q.marks, 0).toString()
  );
  const [timeTaken, setTimeTaken] = useState(
    paper.solvedInfo?.timeTaken?.toString() || ""
  );
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    paper.solvedInfo?.difficulty || "medium"
  );

  const { logSolvedPaper } = usePastPapers();
  const { createFolder, addCalculationToFolder, getAllFolders } = useFolders();
  const { toast } = useToast();

  const handleSave = async () => {
    const scoreNum = parseInt(score);
    const totalNum = parseInt(totalMarks);
    const timeNum = parseInt(timeTaken);

    if (isNaN(scoreNum) || isNaN(totalNum) || isNaN(timeNum)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for all fields.",
        variant: "destructive",
      });
      return;
    }

    if (scoreNum > totalNum) {
      toast({
        title: "Invalid Score",
        description: "Score cannot be higher than total marks.",
        variant: "destructive",
      });
      return;
    }

    const solvedInfo = {
      completed: true,
      difficulty,
      score: scoreNum,
      totalMarks: totalNum,
      timeTaken: timeNum,
      completedAt: new Date().toISOString(),
    };

    // Log the solved paper
    const loggedPaper = logSolvedPaper(paper.id, solvedInfo);

    // Find or create "Logged Papers" folder
    const folders = getAllFolders();
    let loggedPapersFolder = folders.find((f) => f.name === "Logged Papers");

    if (!loggedPapersFolder) {
      loggedPapersFolder = createFolder("Logged Papers", "trophy", "green");
    }

    // Create a calculation entry for the dashboard
    const calculationEntry = {
      id: `logged-${paper.id}-${Date.now()}`,
      year: paper.year.toString(),
      session: paper.session,
      rawMark: scoreNum,
      grade: getGradeFromPercentage((scoreNum / totalNum) * 100),
      ums: Math.round((scoreNum / totalNum) * 120), // Assume UMS out of 120
      timestamp: Date.now(),
    };

    // Add to dashboard folder
    addCalculationToFolder(loggedPapersFolder.id, calculationEntry);

    toast({
      title: "Paper Logged Successfully",
      description: `Your performance has been saved to the "Logged Papers" folder in your dashboard.`,
    });

    onClose();
  };

  const getGradeFromPercentage = (percentage: number): string => {
    if (percentage >= 80) return "A*";
    if (percentage >= 70) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "U";
  };

  const getPercentage = () => {
    const scoreNum = parseInt(score);
    const totalNum = parseInt(totalMarks);
    if (isNaN(scoreNum) || isNaN(totalNum) || totalNum === 0) return 0;
    return Math.round((scoreNum / totalNum) * 100);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Log Solved Paper
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">
              {paper.year} {paper.session} - Paper {paper.paperNumber}
            </h4>
            <p className="text-sm text-muted-foreground">
              Record your performance to track your progress over time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Your Score</Label>
              <Input
                id="score"
                type="number"
                placeholder="0"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                min="0"
                max={totalMarks}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total Marks</Label>
              <Input
                id="total"
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time Taken (minutes)</Label>
            <Input
              id="time"
              type="number"
              placeholder="90"
              value={timeTaken}
              onChange={(e) => setTimeTaken(e.target.value)}
              min="1"
            />
          </div>

          <div className="space-y-3">
            <Label>Difficulty Level</Label>
            <RadioGroup
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as any)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="easy" />
                <Label htmlFor="easy" className="flex items-center gap-2">
                  Easy
                  <Badge className="bg-green-100 text-green-800">😊</Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="flex items-center gap-2">
                  Medium
                  <Badge className="bg-yellow-100 text-yellow-800">😐</Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" />
                <Label htmlFor="hard" className="flex items-center gap-2">
                  Hard
                  <Badge className="bg-red-100 text-red-800">😰</Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {score && totalMarks && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance Summary</span>
                <Badge className={getDifficultyColor(difficulty)}>
                  {difficulty}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {getPercentage()}% ({score}/{totalMarks})
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated Grade:{" "}
                  <span className="font-medium">
                    {getGradeFromPercentage(getPercentage())}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
