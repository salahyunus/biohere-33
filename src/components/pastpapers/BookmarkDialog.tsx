import React, { useState } from "react";
import { Bookmark, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { type PastPaper } from "@/hooks/usePastPapers";

interface BookmarkDialogProps {
  paper: PastPaper;
  onClose: () => void;
  onBookmark: (questionNumbers?: string[]) => void;
}

export const BookmarkDialog: React.FC<BookmarkDialogProps> = ({
  paper,
  onClose,
  onBookmark,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [bookmarkType, setBookmarkType] = useState<"full" | "questions">(
    "full"
  );

  const handleQuestionToggle = (questionNumber: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionNumber)
        ? prev.filter((q) => q !== questionNumber)
        : [...prev, questionNumber]
    );
  };

  const handleBookmark = () => {
    if (bookmarkType === "full") {
      onBookmark();
    } else {
      onBookmark(selectedQuestions);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Bookmark Paper
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">
              {paper.year} {paper.session} - Paper {paper.paperNumber}
            </h4>
            <p className="text-sm text-muted-foreground">
              Choose what you want to bookmark from this paper.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="full-paper"
                checked={bookmarkType === "full"}
                onCheckedChange={(checked) => {
                  if (checked) setBookmarkType("full");
                }}
              />
              <Label htmlFor="full-paper" className="font-medium">
                Bookmark entire paper
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="specific-questions"
                checked={bookmarkType === "questions"}
                onCheckedChange={(checked) => {
                  if (checked) setBookmarkType("questions");
                }}
              />
              <Label htmlFor="specific-questions" className="font-medium">
                Bookmark specific questions
              </Label>
            </div>
          </div>

          {bookmarkType === "questions" && (
            <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
              <Label className="text-sm font-medium">
                Select questions to bookmark:
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {paper.questions.map((question) => (
                  <div
                    key={question.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={question.id}
                      checked={selectedQuestions.includes(question.number)}
                      onCheckedChange={() =>
                        handleQuestionToggle(question.number)
                      }
                    />
                    <Label
                      htmlFor={question.id}
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      Question {question.number}
                      <Badge variant="outline" className="text-xs">
                        {question.marks}m
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>

              {selectedQuestions.length === 0 &&
                bookmarkType === "questions" && (
                  <p className="text-sm text-muted-foreground italic">
                    Please select at least one question to bookmark.
                  </p>
                )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleBookmark}
              disabled={
                bookmarkType === "questions" && selectedQuestions.length === 0
              }
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmark
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
