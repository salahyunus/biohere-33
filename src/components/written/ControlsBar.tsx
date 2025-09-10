import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FileText,
  BookMarked,
  Eye,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Clock,
  Settings,
} from "lucide-react";
import { WrittenProgress } from "@/data/writtenPapers";

interface ControlsBarProps {
  progress: WrittenProgress;
  isTimerVisible: boolean;
  onShowTimer: () => void;
  onRevealAll: () => void;
  onResetPaper: () => void;
  onViewModeChange: (mode: "play-mode" | "exam-view") => void;
  onSubmissionModeChange: (
    mode: "question-by-question" | "submit-at-end"
  ) => void;
  getSamplePDFUrl: () => string;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  progress,
  isTimerVisible,
  onShowTimer,
  onRevealAll,
  onResetPaper,
  onViewModeChange,
  onSubmissionModeChange,
  getSamplePDFUrl,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
              Controls
            </Button>
          </div>

          {!isCollapsed && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(getSamplePDFUrl(), "_blank")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Question Paper
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(getSamplePDFUrl(), "_blank")}
              >
                <BookMarked className="h-4 w-4 mr-2" />
                Mark Scheme
              </Button>

              {!isTimerVisible && (
                <Button variant="outline" size="sm" onClick={onShowTimer}>
                  <Clock className="h-4 w-4 mr-2" />
                  Show Timer
                </Button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Reveal All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reveal All Answers?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will show all model answers. This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onRevealAll}>
                      Yes, Reveal All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Paper
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Paper?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear all your answers and progress. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onResetPaper}>
                      Yes, Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                <Settings className="h-4 w-4 text-muted-foreground" />

                <Select
                  value={progress.viewMode}
                  onValueChange={onViewModeChange}
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="play-mode">Question Mode</SelectItem>
                    <SelectItem value="exam-view">Exam View</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={progress.submissionMode}
                  onValueChange={onSubmissionModeChange}
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="question-by-question">
                      Submit Each
                    </SelectItem>
                    <SelectItem value="submit-at-end">Submit at End</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
