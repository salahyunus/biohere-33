import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import {
  WrittenQuestion,
  WrittenProgress,
  WrittenPaper,
} from "@/data/writtenPapers";
import { cn } from "@/lib/utils";

interface ReviewModeProps {
  paper: WrittenPaper;
  progress: WrittenProgress;
}

export const ReviewMode: React.FC<ReviewModeProps> = ({ paper, progress }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showModelAnswer, setShowModelAnswer] = useState(true);

  const currentQuestion = paper.questions[currentQuestionIndex];
  const userAnswer = progress.answers[currentQuestion.id];

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  const highlightKeywords = (text: string, isModelAnswer = false) => {
    let highlightedText = text;

    currentQuestion.markScheme.forEach((point) => {
      const allKeywords = [...point.keywords, ...(point.synonyms || [])];

      allKeywords.forEach((keyword) => {
        const regex = new RegExp(
          `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
          "gi"
        );
        const colorClass = isModelAnswer
          ? "bg-green-100 text-green-800 px-1 rounded"
          : "bg-blue-100 text-blue-800 px-1 rounded font-medium";
        highlightedText = highlightedText.replace(
          regex,
          `<span class="${colorClass}">$&</span>`
        );
      });
    });

    return highlightedText;
  };

  const getScoreColor = (awarded: number, total: number) => {
    const percentage = (awarded / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const goToPrevious = () => {
    setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
  };

  const goToNext = () => {
    setCurrentQuestionIndex(
      Math.min(paper.questions.length - 1, currentQuestionIndex + 1)
    );
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Badge variant="outline" className="text-sm">
            Question {currentQuestionIndex + 1} of {paper.questions.length}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={currentQuestionIndex === paper.questions.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowModelAnswer(!showModelAnswer)}
        >
          {showModelAnswer ? (
            <EyeOff className="h-4 w-4 mr-2" />
          ) : (
            <Eye className="h-4 w-4 mr-2" />
          )}
          {showModelAnswer ? "Hide" : "Show"} Model Answer
        </Button>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                Question {currentQuestion.number}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {currentQuestion.totalMarks} mark
                  {currentQuestion.totalMarks !== 1 ? "s" : ""}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-medium",
                    getScoreColor(
                      userAnswer?.marksAwarded || 0,
                      currentQuestion.totalMarks
                    )
                  )}
                >
                  {userAnswer?.marksAwarded || 0}/{currentQuestion.totalMarks}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: formatText(currentQuestion.question),
            }}
          />

          {currentQuestion.hasImages && (
            <div className="border rounded-lg overflow-hidden">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Question diagram"
                className="w-full h-auto"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Answer Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-base text-blue-600">Your Answer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userAnswer?.answer ? (
            <>
              <div className="p-3 bg-muted rounded-md">
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightKeywords(userAnswer.answer, false),
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {userAnswer.answer.length} characters
              </div>
            </>
          ) : (
            <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground italic">
              No answer provided
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Answer Card */}
      {showModelAnswer && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-base text-green-600">
              Model Answer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightKeywords(
                  formatText(currentQuestion.modelAnswer),
                  true
                ),
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Quick Navigation */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {paper.questions.map((_, index) => {
              const questionAnswer =
                progress.answers[paper.questions[index].id];
              const hasAnswer =
                questionAnswer?.answer &&
                questionAnswer.answer.trim().length > 0;
              const marks = questionAnswer?.marksAwarded || 0;
              const totalMarks = paper.questions[index].totalMarks;
              const percentage = (marks / totalMarks) * 100;

              let variant: "default" | "secondary" | "outline" = "outline";
              if (hasAnswer) {
                if (percentage >= 80) variant = "default";
                else if (percentage >= 60) variant = "secondary";
              }

              return (
                <Button
                  key={index}
                  variant={index === currentQuestionIndex ? "default" : variant}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={cn(
                    "text-xs",
                    index === currentQuestionIndex && "ring-2 ring-primary/50"
                  )}
                >
                  Q{index + 1}
                  {hasAnswer && (
                    <span className="ml-1 text-xs">
                      {marks}/{totalMarks}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
