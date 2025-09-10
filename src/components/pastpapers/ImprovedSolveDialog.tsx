import React, { useState } from "react";
import { Trophy, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type PastPaper, usePastPapers } from "@/hooks/usePastPapers";
import { useGradeBoundaryData } from "@/hooks/useGradeBoundaryData";
import { saveToDashboard } from "@/utils/dashboardHelpers";

interface ImprovedSolveDialogProps {
  paper: PastPaper;
  onClose: () => void;
}

export const ImprovedSolveDialog: React.FC<ImprovedSolveDialogProps> = ({
  paper,
  onClose,
}) => {
  const [score, setScore] = useState(paper.solvedInfo?.score?.toString() || "");
  const [totalMarks, setTotalMarks] = useState(
    paper.solvedInfo?.totalMarks?.toString() || "90"
  );
  const [timeTaken, setTimeTaken] = useState(
    paper.solvedInfo?.timeTaken?.toString() || ""
  );
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    paper.solvedInfo?.difficulty || "medium"
  );

  const { logSolvedPaper } = usePastPapers();
  const { calculateGradeAndUMS } = useGradeBoundaryData();

  const scoreNum = parseInt(score) || 0;
  const totalMarksNum = parseInt(totalMarks) || 90;
  const percentage =
    totalMarksNum > 0 ? Math.round((scoreNum / totalMarksNum) * 100) : 0;

  // Calculate grade and UMS using grade boundaries
  const gradeResult = calculateGradeAndUMS(
    paper.year.toString(),
    paper.session.toLowerCase(),
    scoreNum
  );

  const handleSubmit = () => {
    if (!score || !totalMarks || !timeTaken) return;

    const solvedInfo = {
      completed: true,
      difficulty,
      score: scoreNum,
      totalMarks: totalMarksNum,
      timeTaken: parseInt(timeTaken),
      completedAt: new Date().toISOString(),
      grade: gradeResult?.grade || "U",
      ums: gradeResult?.ums || 0,
    };

    // Log to past papers system
    logSolvedPaper(paper.id, solvedInfo);

    // Save to dashboard
    saveToDashboard({
      year: paper.year.toString(),
      session: paper.session,
      rawMark: scoreNum,
      grade: gradeResult?.grade || "U",
      ums: gradeResult?.ums || 0,
    });

    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Log Paper Performance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">
              {paper.year} {paper.session} - Paper {paper.paperNumber}
            </h4>
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
              <Label htmlFor="total-marks">Total Marks</Label>
              <Input
                id="total-marks"
                type="number"
                placeholder="90"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-taken">Time Taken (minutes)</Label>
            <Input
              id="time-taken"
              type="number"
              placeholder="90"
              value={timeTaken}
              onChange={(e) => setTimeTaken(e.target.value)}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(value: "easy" | "medium" | "hard") =>
                setDifficulty(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Preview */}
          {score && totalMarks && (
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-medium text-sm">Results Preview:</h4>
                <div className="flex items-center justify-between text-sm">
                  <span>Percentage:</span>
                  <Badge variant="outline">{percentage}%</Badge>
                </div>
                {gradeResult && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span>Grade:</span>
                      <Badge
                        variant={
                          gradeResult.grade === "A*" ? "default" : "secondary"
                        }
                      >
                        {gradeResult.grade}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>UMS:</span>
                      <Badge variant="outline">{gradeResult.ums}</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!score || !totalMarks || !timeTaken}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Log Performance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
